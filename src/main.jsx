import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes>
            <Route path="/dog-search-app" element={<LoginPage />} />
            <Route path="/search" element={<SearchPage />} />
        </Routes>
    </BrowserRouter>
);
