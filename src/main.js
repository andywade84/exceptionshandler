import './styles/main.css';

import Alpine from 'alpinejs';
import persist from '@alpinejs/persist';
import {
  addTimeException,
  getUserDetails,
  updateUI,
  downloadTimeExceptions,
  generateMailtoLink,
  saveDetailsAndDisplayContent,
} from './timeExceptionFunctions.js';
window.Alpine = Alpine;

Alpine.plugin(persist);

document.addEventListener('alpine:init', () => {
  Alpine.data('banner', function () {
    return {
      show: this.$persist(false),
      dismissed: this.$persist(false),

      dismiss() {
        this.show = false;
        this.dismissed = true;
      },

      init() {
        if (!this.dismissed) {
          setTimeout(() => {
            this.show = true;
          }, 1500);
        }
      },
    };
  });
});

Alpine.start();

const env = document.querySelector('body').dataset.env;

// Check that service workers are supported
if ('serviceWorker' in navigator && env === 'production') {
  // use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    try {
      navigator.serviceWorker.register('/sw.js');
    } catch (error) {
      console.error('Service worker registration failed: ', error);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializePage();
  document
    .getElementById('saveDetailsBtn')
    .addEventListener('click', saveDetailsAndDisplayContent);
  document.getElementById('addExceptionBtn').addEventListener('click', () => {
    document.getElementById('timeExceptionForm').style.display = 'block';
  });
  document
    .getElementById('submitExceptionBtn')
    .addEventListener('click', addTimeException);
  document
    .getElementById('downloadExceptionsBtn')
    .addEventListener('click', downloadTimeExceptions);
  document
    .getElementById('emailExceptionsBtn')
    .addEventListener('click', generateMailtoLink);
  // Additional setup can go here
});

export function initializePage() {
  const { userDetails, lineManagerDetails } = getUserDetails();
  if (userDetails && lineManagerDetails) {
    document.getElementById('detailsForm').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    updateUI();
  } else {
    document.getElementById('detailsForm').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';
  }
}
