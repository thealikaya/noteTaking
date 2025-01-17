/**
 * @copyright codewithsadee 2023
 */

'use strict';

export const Tooltip = function (element){
    const tooltip = document.createElement("span");
    tooltip.classList.add("tooltip" , "text-body-small");
    element.addEventListener("mouseenter", () => {
        tooltip.textContent =  element.dataset.tooltip;

        const {
            top,
            left,
            height,
            width
        } = element.getBoundingClientRect();

        tooltip.style.top = top + height + 4 + "px";
        tooltip.style.left = left + (width/2) + "px";
        tooltip.style.transform = "translate(-50%, 0)";
        document.body.appendChild(tooltip);
    });

    element.addEventListener("mouseleave", tooltip.remove.bind(tooltip));
}