const html = '<i class="fa-solid fa-user"></i>';
const iconMap = {'user': 'solid'};
let res = html.replace(/<i([^>]*)class="([^"]*fa-[^"]*)"([^>]*)><\/i>/g, (match, before, classes, after) => {
    const matchClass = classes.match(/fa-([a-z0-9-]+)/g);
    if (!matchClass) return match;
    let actualName = null;
    matchClass.forEach(cls => {
      const name = cls.replace('fa-', '');
      if (name !== 'solid' && name !== 'brands' && name !== 'regular' && name !== 'fw') {
        actualName = name;
      }
    });
    
    if (actualName && iconMap[actualName]) {
       return `<svg class="icon ${classes.replace('fa-solid','').replace('fa-brands','').replace('fa-regular','')}" aria-hidden="true"${before}${after}><use href="assets/icons.svg#fa-${actualName}"></use></svg>`.replace(/  +/g, ' ');
    }
    return match;
  });
console.log(res);
