const classes = {
    default: "imgStyle",
    lightBoxImage: "lightBoxStyleImg",
    lightBoxDiv: "lightBoxStyleDiv"
}

const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;
const ESCAPE = 27;


let inLightBox = false;
const opaqueDiv = document.createElement("div") as HTMLDivElement;
opaqueDiv.classList.add(classes.lightBoxDiv);
let lightBoxCurrent: ImageHolder;

class ImageHolder {
    public original: HTMLImageElement;
    public clone: HTMLImageElement;

    constructor(original: HTMLImageElement, clone: HTMLImageElement) {
        this.original = original;
        this.clone = clone;
    }
}

document.addEventListener("click", (ev) => {
    if (ev.target instanceof HTMLImageElement && !inLightBox) {
        inLightBox = true;
        handleLightBox(ev.target as HTMLImageElement, true);
    }

    if (ev.target instanceof HTMLDivElement && ev.target as HTMLDivElement == opaqueDiv) {
        handleLightBoxLeave();
    }
});

const handleKeyUp = (ev: KeyboardEvent) => {
    if (!inLightBox) {
        return;
    }

    switch (ev.keyCode) {
        case RIGHT_ARROW:
            handleLightBox(getNextImage(lightBoxCurrent.original));
            break;
        case LEFT_ARROW:
            handleLightBox(getPrevImage(lightBoxCurrent.original));
            break;
        case ESCAPE:
            handleLightBoxLeave();
            break;
    }
}

window.onkeyup = handleKeyUp;

const handleLightBox = (image: HTMLImageElement, enter = false) => {
    if (!enter) {
        removeFromDom(lightBoxCurrent.clone);
    }

    const body = document.getElementsByTagName("body")[0];
    lightBoxCurrent = new ImageHolder(image, image.cloneNode() as HTMLImageElement);
    lightBoxCurrent.clone.classList.add(classes.lightBoxImage);
    lightBoxCurrent.clone.classList.remove(classes.default);


    body.appendChild(lightBoxCurrent.clone);
    body.appendChild(opaqueDiv);
}

const getNextImage = (current: HTMLImageElement): HTMLImageElement => {
    const images = getAllImages();
    return images[(images.indexOf(current) + 1) % images.length];
}

const getPrevImage = (current: HTMLImageElement): HTMLImageElement => {
    const images = getAllImages();
    return images[(images.indexOf(current) + images.length - 1) % images.length]
}

const getAllImages = (): HTMLImageElement[] => {
    return Array.from(document.getElementsByClassName(classes.default)).map(el => el as HTMLImageElement);
}

const handleLightBoxLeave = () => {
    removeFromDom(opaqueDiv);
    removeFromDom(lightBoxCurrent.clone);

    inLightBox = false;
}

const removeFromDom = (html: HTMLElement) => {
    html.parentElement.removeChild(html);
}
