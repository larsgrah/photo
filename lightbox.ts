const classes = {
    default: "kloudBoxDefault",
    lightBoxImage: "lightBoxStyleImg",
    lightBoxDiv: "lightBoxStyleDiv"
}

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
            if (!this.checkResponsible(ev.target)) {
                return;
            }

            if (ev.target instanceof HTMLImageElement && !this.inLightBox) {
                this.inLightBox = true;
                this.handleLightBox(ev.target as HTMLImageElement, true);
            }

            if (ev.target instanceof HTMLDivElement && ev.target as HTMLDivElement == this.opaqueDiv) {
                this.handleLightBoxLeave();
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
    }

    public handleLightBox = (image: HTMLImageElement, enter = false) => {
        if (!enter) {
            this.removeFromDom(this.lightBoxCurrent.clone);
        }

        const body = document.getElementsByTagName("body")[0];
        this.lightBoxCurrent = new ImageHolder(image, image.cloneNode() as HTMLImageElement);
        this.lightBoxCurrent.clone.classList.add(classes.lightBoxImage);
        this.lightBoxCurrent.clone.classList.remove(classes.default);


        body.appendChild(this.lightBoxCurrent.clone);
        body.appendChild(this.opaqueDiv);
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

    private handleLightBoxLeave = () => {
        this.removeFromDom(this.opaqueDiv);
        this.removeFromDom(this.lightBoxCurrent.clone);

        this.inLightBox = false;
    }

    private removeFromDom = (html: HTMLElement) => {
        html.parentElement.removeChild(html);
    }

    private checkResponsible = (it: EventTarget) => {
        return it instanceof HTMLElement && this.scoped ? (it as HTMLElement).classList.contains(this.scope) : true;
    }

}

const lb = new Kloudbox("defaultLb");
