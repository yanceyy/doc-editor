import "./App.css";

import { Editor } from "./Editor";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

function App() {
    return (
        <>
            <Header />
            <Editor />
            <Footer />
        </>
    );
}

export default App;
