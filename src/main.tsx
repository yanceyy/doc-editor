import "./index.css";

import App from "./App.tsx";
import { ChakraProvider } from "ui-components";
import React from "react";
import ReactDOM from "react-dom/client";

// Todo: lazy loading resources
const EduSABeginner = new FontFace(
    "EduSABeginner",
    "url(/fonts/EduSABeginner-VariableFont_wght.ttf)"
);
const Lumanosimo = new FontFace(
    "Lumanosimo",
    "url(/fonts/Lumanosimo-Regular.ttf)"
);

document.fonts.add(EduSABeginner);
document.fonts.add(Lumanosimo);

Promise.all([EduSABeginner.load(), Lumanosimo.load()]).finally(() => {
    void document.fonts.ready.then(() => {
        ReactDOM.createRoot(document.getElementById("root")!).render(
            <React.StrictMode>
                <ChakraProvider>
                    <App />
                </ChakraProvider>
            </React.StrictMode>
        );
    });
});
