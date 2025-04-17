# SE-3355 Web Development Midterm Project - E-commerce Landing Page

This project is a responsive e-commerce landing page created for the SE-3355 Web Development Midterm. The implementation is modeled after a popular Turkish e-commerce platform (Hepsiburada) 

## Assumptions


- All clickable elements redirect to the original Hepsiburada website.
- I assumed that images for the sliders, quick links, products, and electronics section were provided by the backend. Since we couldn't mock image hosting/retrieval logic using a mock API, I added images to the project source and used [mocky.io](https://mocky.io) to return the image link as a relative path. This was done instead of linking directly to Hepsiburada images, which may be deleted in the future.

## Features

- **Responsive Navigation Menu** – A sticky menu with dropdown submenu items  
- **Quick Links Section** – Campaign cards fetched from mock API  
- **Main Product Slider** – Carousel featuring products and campaigns  
- **Electronics Deals Section** – Rotating products with prices every 3 seconds  
- **Personalized Recommendations** – Product cards with price and review ratings  

## Technologies Used

- HTML5  
- CSS3  
- JavaScript (ES6+) 
- Fetch API  
- [mocky.io](https://mocky.io) for simulating backend APIs


## local Development

Open `index.html` in your browser to view it locally

## Live Demo

👉 [https://emreutkan.github.io/se-3355-web-development-midterm-1/](https://emreutkan.github.io/se-3355-web-development-midterm-1/)

## API Integration

The project uses mock APIs from [mocky.io](https://designer.mocky.io/) to simulate:

- Quick links  
- Slider content  
- Electronics deals  
- Recommended products


## Project Requirements

This project fulfills the following:

- Sticky, responsive menu with 2 items having at least 3 submenus each  
- Quick Links section with at least 8 campaigns (from mock API)  
- Main slider with 10+ products or campaigns (from mock API)  
- "Elektronik Fırsatlar" section showing 3 rotating products with prices  
- "Sana Özel Öneriler" section with 5+ products with price and rating

## Contributors

Created by **İrfan Emre Utkan** for **Group 2**, SE-3355 Web Development course. 
