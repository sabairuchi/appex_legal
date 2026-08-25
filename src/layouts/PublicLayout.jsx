import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import ScrollReveal from '../components/ScrollReveal';

export default function PublicLayout() {
  return (
    <div className="app-container">
      <ScrollToTop />
      <ScrollReveal />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
