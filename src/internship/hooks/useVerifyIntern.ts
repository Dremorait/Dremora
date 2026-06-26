import { useState, useCallback } from 'react';
import { supabase } from './useSupabase';
import { Intern } from '../types';
import { sanitizeInput, isValidInternId, isValidName } from '../utils/validation';

export const useVerifyIntern = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Intern | null>(null);

  const verify = useCallback(async (internId: string, fullName: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const sanitizedId = sanitizeInput(internId);
      const sanitizedName = sanitizeInput(fullName);

      if (!isValidInternId(sanitizedId) || !isValidName(sanitizedName)) {
        setError("Invalid input format. Please check your details.");
        setLoading(false);
        return;
      }

      // Query Supabase
      // Using ilike for case-insensitive exact matching
      const { data, error: dbError } = await supabase
        .from('interns')
        .select('*')
        .ilike('intern_id', sanitizedId)
        .ilike('full_name', sanitizedName)
        .limit(1)
        .single();

      if (dbError) {
        if (dbError.code === 'PGRST116') {
          // No rows returned
          setError("Verification Failed. We couldn't find an internship record matching the provided details.");
        } else {
          console.error("Supabase Error:", dbError);
          setError("A system error occurred. Please try again later.");
        }
      } else if (data) {
        setResult(data as Intern);
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { verify, loading, error, result, reset: () => { setResult(null); setError(null); } };
};
