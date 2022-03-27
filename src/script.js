
const APP_ID = "pixmoji", w = window;
w[APP_ID] = (() => {
  const d = document,
    o = document.getElementById('o'),
    s = document.getElementById('s'),
    palette = "⬛⬜🟥🟦🟨🟩🟧🟪🟫".split(/.*?/u), //square emojis
    BRUSH = 0,
    FILL = 1,
    TOOLS = ['🖌️', '🪣']
  ;
  let grid = [], //the grid
    // history = [],
    // gallery = [],
    // count = 0, time = 0;
    width = 8,
    height = 8,
    selectedTool = BRUSH,
    color = [palette[0], palette[1]] //[brushColor, fillColor]
  ;

  const SIZE = { MIN: 5, MAX: 16, SM: 11 };
    //create new array and fill it
  const arrAndFill = (size, fill = 0) => new Array(size).fill(fill);

    //initialize grid and render it
  const init = () => { grid = arrAndFill(height).map(_ => arrAndFill(width, color[FILL])); render(); },

    wrapRow = row => `<div class=row>${row}</div>`,

    renderBtn = (text, onclick, disabled = 0, hasBtnClass = 0) => (
      `<button onclick=${APP_ID}.${onclick}${disabled ? ' disabled' : ''}${hasBtnClass ? ` class=btn` : ''}>${text}</button>`
    )
  ;

  const renderTool = (emoji, tool) => {
      const disabled = selectedTool == tool ? ' disabled' : '';
      return wrapRow(
        renderBtn(emoji, `selectTool(${tool})`, disabled)
        + palette.map(a => renderBtn(a, `selectColor('${a}',${tool})`, color[tool] == a)).join("")
      );
    },

    renderResizeBtn = (add, isWidth) => {
      const isAdd = add > 0;
      const size = isWidth ? width : height;
      const disabled = isAdd ? size === SIZE.MAX : size === SIZE.MIN;
      const emoji = isAdd ? '➕' : '➖';
      const direction = isWidth ? '↔️' : '↕️';
      return renderBtn(emoji + direction, `resize(${add},${isWidth})`, disabled, true);
    },

    renderGrid = () => {
      return wrapRow(
        [`<table class="${width >= SIZE.SM ? 'sm-' + width :''}">`,
        grid.map((a, i) => `<tr>${a.map((b,j) => `<td onclick="${APP_ID}.draw(${i},${j})">${b}</td>`).join("")}</tr>`).join(""),
        "</table>"].join("")
      );
    },

    draw = (i, j, startColor = 0) => {
      if (i < 0 || i >= height || j < 0 || j >= width) return;
      const cell = grid[i][j];
      if (selectedTool === BRUSH) {
        grid[i][j] = color[BRUSH] === cell ? color[FILL] : color[BRUSH];
      }
      else if (color[FILL] !== cell) {
        if (!startColor) startColor = cell;
        if (cell === startColor) {
          grid[i][j] = color[FILL];
          draw(i - 1, j, startColor);
          draw(i + 1, j, startColor);
          draw(i, j - 1, startColor);
          draw(i, j + 1, startColor);
        }
      }
      render();
    },

    render = () => o.innerHTML = [
      TOOLS.map(renderTool).join(""),
      renderGrid(),
      //wrapRow([['undo','↩️ Undo'],['redo','↪️ Redo']].map(btn => renderBtn(btn[1], `${btn[0]}()`, 0, 1)).join("")),
      wrapRow([['copyGrid','📋 Copy'],['reset','🔃 Reset']].map(btn => renderBtn(btn[1], `${btn[0]}()`, 0, 1)).join("")),
      // wrapRow([['save','💾 Save'],['viewGallery','🖼️ Gallery']].map(btn => renderBtn(btn[1], `${btn[0]}()`, 0, 1)).join("")),
      wrapRow(`${width} x ${height}`),
      wrapRow([1, -1].map(a => renderResizeBtn(a, 1)).join("")),
      wrapRow([1, -1].map(a => renderResizeBtn(a, 0)).join("")),
    ].join("")
  ;

  //initialize
  
  d.addEventListener("resize", render);
  init();

  return {
    "copyGrid": () => navigator.clipboard.writeText(grid.map(a=>a.join('')).join("\n") + ` #${APP_ID}`),

    "reset": () => confirm(`Are you sure you want to clear the grid with ${color[FILL]}?`) && init(),

    "selectColor": (selectedColor, tool) => { color[tool] = selectedColor; render(); },

    "selectTool": tool => { selectedTool = tool; render(); },

    "draw": draw,

    "resize": (addSize, isWidth) => { //increase/decrease grid size
      const { MIN, MAX } = SIZE;
      if (isWidth) {
        if ((addSize < 0 && width <= MIN) || (addSize > 0 && width >= MAX)) return;
        width += addSize;
      }
      else {
        if ((addSize < 0 && height <= MIN) || (addSize > 0 && height >= MAX)) return;
        height += addSize;
      }
      // this allows the reverse to happen when increase/decreasing
      const isReducing = addSize < 0 ? 0 : 1;
      const size = isWidth ? width : height;
      const alternate = size % 2 === isReducing;
      if (addSize < 0) {//reducing size
        const index = alternate ? 0 : 1;
        if (isWidth) {
          grid = grid.map(r => r.splice(index, width));
        }
        else {
          grid = grid.splice(index, height);
        }
      }
      else {//increase size
        const method = alternate ? "push" : "unshift";
        if (isWidth) {
          grid.forEach(r => alternate ? r[method](color[FILL]) : r[method](color[FILL]));
        }
        else {
          grid[method](arrAndFill(width, color[FILL]));
        }
      }
      //resize font based on width of grid and screen
      let fontSize;
      if (w.innerWidth > 800) {//see CSS for media 800px conditions
        fontSize = 30 - ((width - 10) * 2) + "px";
      }
      else {
        fontSize = (Math.floor((5.3 - ((width - 10) * .3)) * 10) / 10) + "vw";
      }
      s.innerHTML = `table > tbody > tr > td { font-size: ${fontSize}; }`;
      render();
    },
  };
})();