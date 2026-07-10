import sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

eduro_project = '''      {
        id: 'eduro',
        title: "EDURO - Premium Coaching Platform",
        category: "Enterprise Platform",
        desc: "A premium enterprise-grade digital platform for a coaching institute featuring a cinematic UI, AI-ready architecture, admissions CRM, student & parent portals, and analytics.",
        image: "assets/images/eduro.png",
        tech: ["Next.js", "React", "Tailwind", "Prisma"]
      },
'''

if 'EDURO - Premium Coaching Platform' not in content:
    content = content.replace('    const projects = [\n', '    const projects = [\n' + eduro_project)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Inserted EDURO into index.html projects array')
else:
    print('EDURO already in index.html')
