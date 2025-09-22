import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Recipes from '../pages/Recipes';
import RecipeDetail from '../pages/RecipeDetail';
import RecipeEdit from '../pages/RecipeEdit';
import Saved from '../pages/Saved';
import Planner from '../pages/Planner';
import CookingMode from '../pages/CookingMode';
import Community from '../pages/Community';
import Premium from '../pages/Premium';
import AuthCallback from '../pages/AuthCallback';

/**
 * PUBLIC_INTERFACE
 * AppRouter defines all client routes and connects pages.
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="auth/callback" element={<AuthCallback />} />
        <Route path="profile" element={<Profile />} />
        <Route path="recipes" element={<Recipes />} />
        <Route path="recipes/:id" element={<RecipeDetail />} />
        <Route path="recipes/:id/edit" element={<RecipeEdit />} />
        <Route path="recipes/new" element={<RecipeEdit />} />
        <Route path="saved" element={<Saved />} />
        <Route path="planner" element={<Planner />} />
        <Route path="cook/:id" element={<CookingMode />} />
        <Route path="community" element={<Community />} />
        <Route path="premium" element={<Premium />} />
      </Routes>
    </BrowserRouter>
  );
}
