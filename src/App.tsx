import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Components
import { LoginPage } from "./pages/LoginPage";

// CSS
import "./App.scss";
import { HomePage } from "./pages/HomePage";
import { MakeReviewPage } from "./pages/MakeReviewPage";
import { ReviewPage } from "./pages/ReviewPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/review/:review_id" element={<ReviewPage />} />
          <Route path="/make_review/:movieName" element={<MakeReviewPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/homepage/:category_slug" element={<HomePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
