import './style.css';

import {
  computePosition,
  flip,
  shift,
  offset,
  arrow,
  autoUpdate,
} from '@floating-ui/dom';

const button = document.querySelector('#button');
const tooltip = document.querySelector('#tooltip');
const arrowElement = document.querySelector('#arrow');

function update() {
  computePosition(button, tooltip, {
    placement: 'bottom',
    middleware: [
      offset(6),
      flip(),
      shift({ padding: 5 }),
      arrow({ element: arrowElement })
    ],
  }).then(({x, y, placement, middlewareData}) => {
    Object.assign(tooltip.style, {
      left: `${x}px`,
      top: `${y}px`,
    });

    // Accessing the data
    const {x: arrowX, y: arrowY} = middlewareData.arrow;

    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[placement.split('-')[0]];

    Object.assign(arrowElement.style, {
      left: arrowX != null ? `${arrowX}px` : '',
      top: arrowY != null ? `${arrowY}px` : '',
      right: '',
      bottom: '',
      [staticSide]: '-4px',
    });
  });
}

let cleanup;

function showTooltip() {
  tooltip.style.display = "block";
  tooltip.classList.add("fadeIn");
  cleanup = autoUpdate(button, tooltip, update);

  function handleShowTooltip() {
    tooltip.style.opacity = 1;
    tooltip.classList.remove("fadeIn");
  
    tooltip.removeEventListener("animationend", handleShowTooltip);
  }

  tooltip.addEventListener("animationend", handleShowTooltip);
}

function hideTooltip() {
  tooltip.classList.add("fadeOut");
  cleanup();

  function handleHideTooltip() {
    tooltip.style.display = "";
    tooltip.style.opacity = "";
    tooltip.classList.remove("fadeOut");
  
    tooltip.removeEventListener("animationend", handleHideTooltip);
  }

  tooltip.addEventListener("animationend", handleHideTooltip);
}

[
  ['focus', showTooltip],
  ['blur', hideTooltip],
].forEach(([event, listener]) => {
  button.addEventListener(event, listener);
});

document.getElementById("cleanup").addEventListener("click", () => cleanup());
