const classes = {
    default: "kloudBoxDefault",
    lightBoxImage: "lightBoxStyleImg",
    lightBoxDiv: "lightBoxStyleDiv",
    arrow: "arrowSvg",
    arrowRight: "arrowSvgRight",
    arrowLeft: "arrowSvgLeft"
}
const arrowHtml = `<svg class="arrowSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
<defs id="defs3051">
    <style type="text/css" id="current-color-scheme">
        .ColorScheme-Text {
            color: #fffff;
        }
    </style>
</defs>
<path style="fill:currentColor;fill-opacity:1;stroke:none"
    d="m7.707031 3l-.707031.707031 6.125 6.125 1.167969 1.167969-1.167969 1.167969-6.125 6.125.707031.707031 6.125-6.125 1.875-1.875-1.875-1.875-6.125-6.125"
    class="ColorScheme-Text"></path>
</svg>`

const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const ESCAPE = 27;

class ImageHolder {
    public original: HTMLImageElement;
    public clone: HTMLImageElement;

    constructor(original: HTMLImageElement, clone: HTMLImageElement) {
        this.original = original;
        this.clone = clone;
    }
}

export class Kloudbox {
    private inLightBox = false;
    private opaqueDiv = document.createElement("div") as HTMLDivElement;
    private lightBoxCurrent: ImageHolder;
    private scoped: boolean;
    private scope?: string;

    constructor(targetImg?: string) {
        this.scoped = targetImg != undefined;
        this.scope = targetImg;
        if (!this.scoped) {
            Array.from(document.getElementsByTagName("img")).forEach(el => el.classList.add(classes.default));
        }

        this.opaqueDiv.classList.add(classes.lightBoxDiv);
        document.addEventListener("click", (ev) => {

            if (ev.target instanceof HTMLDivElement && ev.target as HTMLDivElement == this.opaqueDiv) {
                this.handleLightBoxLeave();
            }

            if (!this.checkResponsible(ev.target)) {
                return;
            }

            if (ev.target instanceof HTMLImageElement && !this.inLightBox) {
                this.inLightBox = true;
                this.handleLightBox(ev.target as HTMLImageElement, true);
            }
        });

        const handleKeyUp = (ev: KeyboardEvent) => {
            if (!this.inLightBox) {
                return;
            }

            switch (ev.keyCode) {
                case RIGHT_ARROW:
                    this.handleLightBox(this.getNextImage(this.lightBoxCurrent.original));
                    break;
                case LEFT_ARROW:
                    this.handleLightBox(this.getPrevImage(this.lightBoxCurrent.original));
                    break;
                case ESCAPE:
                    this.handleLightBoxLeave();
                    break;
            }
        }
        this.getAllImages().forEach(image => image.style.cursor = "zoom-in")

        window.onkeyup = handleKeyUp;
    }

    /**
     * this function allows you to refresh the Kloudbox and pass it a new scope. Usefull if you loaded new images since this object was created
     * 
     * @param newScope Optional new scope
     */
    public refresh = (newScope?: string) => {
        if (newScope != undefined) {
            this.scope = newScope;
        }

        if (this.scoped) {
            return;
        }

        if (!this.scoped) {
            Array.from(document.getElementsByTagName("img")).forEach(el => el.classList.add(classes.default));
        }

        this.getAllImages().forEach(image => image.style.cursor = "zoom-in")
    }

    private handleLightBox = (image: HTMLImageElement, enter = false) => {
        const body = document.getElementsByTagName("body")[0];

        if (!enter) {
            this.removeFromDom(this.lightBoxCurrent.clone);
        } else {
            body.insertAdjacentHTML("beforeend", arrowHtml);
            body.insertAdjacentHTML("beforeend", arrowHtml);
            let right = this.getArrows()[0];
            let left = this.getArrows()[1];
            right.classList.add(classes.arrowRight);
            left.classList.add(classes.arrowLeft);
            this.getArrows().forEach(arr => arr.style.cursor = "pointer");

            right.addEventListener("click", ev => this.handleLightBox(this.getNextImage(this.lightBoxCurrent.original)));
            left.addEventListener("click", ev => this.handleLightBox(this.getPrevImage(this.lightBoxCurrent.original));
        }

        this.lightBoxCurrent = new ImageHolder(image, image.cloneNode() as HTMLImageElement);
        this.lightBoxCurrent.clone.classList.add(classes.lightBoxImage);
        this.lightBoxCurrent.clone.classList.remove(classes.default);
        this.lightBoxCurrent.clone.style.cursor = "default";
        body.appendChild(this.lightBoxCurrent.clone);

        if (enter) {
            body.appendChild(this.opaqueDiv);
        }
    }

    private getNextImage = (current: HTMLImageElement): HTMLImageElement => {
        const images = this.getAllImages();
        return images[(images.indexOf(current) + 1) % images.length];
    }

    private getPrevImage = (current: HTMLImageElement): HTMLImageElement => {
        const images = this.getAllImages();
        return images[(images.indexOf(current) + images.length - 1) % images.length]
    }

    private getAllImages = (): HTMLImageElement[] => {
        const className = this.scoped ? this.scope : classes.default;
        return Array.from(document.getElementsByClassName(className)).map(el => el as HTMLImageElement);
    }

    private getArrows = (): HTMLElement[] => {
        return Array.from(document.getElementsByClassName(classes.arrow)).map(it => it as HTMLElement);
    }

    private handleLightBoxLeave = () => {
        this.removeFromDom(this.opaqueDiv);
        this.removeFromDom(this.lightBoxCurrent.clone);
        this.getArrows().forEach(it => this.removeFromDom(it))
        this.inLightBox = false;
    }

    private removeFromDom = (html: HTMLElement) => {
        html.parentElement.removeChild(html);
    }

    private checkResponsible = (it: EventTarget) => {
        return it instanceof HTMLElement && this.scoped ? (it as HTMLElement).classList.contains(this.scope) : true;
    }

}

const lb = new Kloudbox();
