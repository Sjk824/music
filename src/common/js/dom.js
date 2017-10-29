export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
};

export function addClass(el, className) {
  if (hasClass(el, className)) {
    return;
  };

  let newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join(' ');
};

export function removeClass(el, className){
  if (!hasClass(el, className)) {
    return;
  };

  let newClass = el.className.split(' ').filter((item) => {
    return item !== className;
  });
  el.className = newClass.join(' ');
};

export function getData(el, name, val) {
  const prefix = 'data-';
  if (val) {
    return el.setAttribute(prefix + name, val);
  }
  return el.getAttribute(prefix + name);
};

let elementStyle = document.createElement('div').style;

export function prefixStyle(style) {
  const _style = style.charAt(0).toUpperCase() + style.substr(1);
  const transformNames = [
      style,
      'webkit' + _style,
      'Moz' + _style,
      'o' + _style,
      'ms' + _style
    ];

  for (let i = 0; i<transformNames.length; i++) {
    if (elementStyle[transformNames[i]] !== undefined) {
      return transformNames[i];
    };
  };

  return style;
};
