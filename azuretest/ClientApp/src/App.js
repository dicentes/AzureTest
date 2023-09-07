import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import './custom.css';
import { AuthProvider, Login } from './components/Login'; // Correct the import path
import { GoalsProvider } from './components/FetchGoals'; // Import GoalsProvider

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <AuthProvider>
        <GoalsProvider>  {/* Wrap your component tree with GoalsProvider */}
          <Layout>
            <Routes>
              {/* Existing App Routes */}
              {AppRoutes.map((route, index) => {
                const { element, ...rest } = route;
                return <Route key={index} {...rest} element={element} />;
              })}
            </Routes>
          </Layout>
        </GoalsProvider>
      </AuthProvider>
    );
  }
}
