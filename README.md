# Community Issue Reporting Application

This is a full-stack web application that allows users to report community issues such as potholes, power outages, flooding, and more. The app includes location-based features, allowing users to submit issues with geolocation data to display them on an interactive map.

## Features

- **Geolocation-based Issue Reporting**: Users can report issues with their exact location to be displayed on a map.
- **Custom Icons and Markers**: Different issue categories are represented with unique colored icons on the map.
- **File Upload**: Users can upload up to two images per issue.
- **Form Validation**: Server-side validation to ensure all required fields are properly filled.
- **Responsive Design**: Optimized for both desktop and mobile views.
- **Notifications**: Toast notifications for success and error handling.

## Technologies Used

- **Frontend**: React.js, Tailwind CSS, Leaflet.js for map visualization, `react-toastify` for notifications.
- **Backend**: Node.js, Express.js, `express-validator` for form validation.
- **API**: Axios for HTTP requests.
- **Other Libraries**: Heroicons, `react-loader-spinner` for loading indicators.

## Setup and Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2. **Install dependencies:**
    - **Backend**:
      ```bash
      cd server
      npm install
      ```
    - **Frontend**:
      ```bash
      cd client
      npm install
      ```

3. **Set up environment variables:**
    Create a `.env` file in the `server` directory and add your environment variables as needed (e.g., API keys, database URIs).

4. **Run the development server:**
    - **Backend**:
      ```bash
      npm run dev
      ```
    - **Frontend**:
      ```bash
      npm start
      ```

5. **Navigate to your application:**
    Open your web browser and go to `http://localhost:3000` for the client, and your backend runs at `http://localhost:5000` (or configured ports).

## Usage

- **Report an Issue**: Navigate to the "Report an Issue" page, fill out the form with the category, description, and location. Upload images and submit.
- **View Issues**: View reported issues on the map, each represented with a marker. Click a marker to see more details.
- **Permission Handling**: Users will be prompted for location access. Ensure your browser settings allow this for optimal experience.


## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request.


## Contact

For any inquiries, please reach out to [dev@zeenomtech.com](mailto:dev@zeenomtech.com).


