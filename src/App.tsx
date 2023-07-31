import "./App.css";

import { Editor } from "./Editor";
import { TextContextMenu } from "./components/ContextMenu";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

function App() {
    return (
        <>
            <Header />
            <Editor />
            <Footer />
            <TextContextMenu />
        </>
    );
}

export default App;
