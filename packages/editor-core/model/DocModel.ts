interface DocModelProps {
    ver: string;
    data: Element[];
    dependencies: Dependencies;
}

interface Dependencies {
    font: string[];
}

export default class DocModel {
    ver: string;
    data: Element[];
    dependencies: Dependencies;

    static of(dataJson: string) {
        const data = JSON.parse(dataJson) as DocModelProps;
        return new DocModel(data);
    }

    constructor({ ver, data, dependencies }: DocModelProps) {
        this.ver = ver;
        this.data = data;
        this.dependencies = dependencies;
    }

    addFont(font: string) {
        if (!this.dependencies.font.includes(font))
            this.dependencies.font.push(font);
    }

    removeFont(font: string) {
        this.dependencies.font = this.dependencies.font.filter(
            (item) => item !== font
        );
    }

    setData(data: Element[]) {
        this.data = data;
    }

    toString() {
        return JSON.stringify({
            ver: this.ver,
            data: this.data,
            dependencies: this.dependencies,
        });
    }
}
