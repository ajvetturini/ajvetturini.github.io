function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");

    menu.classList.toggle('open');    
    icon.classList.toggle('open');    
}


/*const publicationsData = [
    { year: 2023, title: "Publication Title 1", citation: "Author 1 et al.", image_path: "assets/publication_pics/flame_spread_pic.png", metadata: "Best Paper", project_page: "https://github.com/" },
    { year: 2023, title: "Publication Title 2", citation: "Author 2 et al.", image_path: "assets/publication_pics/flame_spread_pic.png", metadata: "" },
    { year: 2022, title: "Publication Title 3", citation: "Author 3 et al.", image_path: "assets/publication_pics/flame_spread_pic.png", metadata: "Project Page" },
    // Add more publications here
];*/

// Function to read in JSON file for printing publication info:
function parseLocalJSONFile(path) {
    return fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonData => {
            return jsonData;
        })
        .catch(error => {
            console.error('Error parsing JSON file:', error);
            return null;
        });
}

// Function to generate HTML for a publication
function generatePublicationHTML(publication) {
    let buttonHTML = '';
    let metadataText = '';
    // Check if project_page exists in the publication
    if (!(publication.project_page === "None")) {
        // If project_page exists, generate HTML for the button
        buttonHTML = `<button class="redirect-button" data-url="${publication.project_page}">Project Page</button>`;
    }
    if (!(publication.metadata === "None")) {
        metadataText = publication.metadata;
    }
    const authorsString = publication.authors;
    const boldAuthorString = authorsString.replace(/A\. Vetturini/g, '<b>A. Vetturini</b>');
    return `
        <div class="publication">
            <img src=${publication.image_preview} alt="Publication Image">
            <div class="publication-content">
                <div style="align-self: flex-start;" class="pub-title"><b>${publication.title}</b></div>
                    <div>${boldAuthorString}</div>
                    <div><i>${publication.journal}</i>, <b>${publication.volume}</b>, ${publication.pages}, ${publication.year}.</div>
                    <br>
                <div>${metadataText}</div>
                <br></br>
                <div class="download-buttons-container">
                    <button class="download-button" data-title="${publication.file}">PDF</button>
                    ${buttonHTML}
                </div>

            </div>
        </div>
            
        </div>
    `;
}

document.addEventListener('click', function(event) {
    // Check if the clicked element is a redirect button
    if (event.target.classList.contains('redirect-button')) {
        // Get the URL from the data attribute
        const url = event.target.getAttribute('data-url');
        // Open the URL in a new tab/window
        window.open(url, '_blank');
    }
});

document.addEventListener('click', function(event) {
    // Check if the clicked element is a download button
    if (event.target.classList.contains('download-button')) {
        // Get the title from the data attribute
        const title = event.target.getAttribute('data-title');
        // Construct the download path
        //const path = `${title}.pdf`; // Assuming the PDF file has the same name as the publication title
        fetch(title)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`File not found: ${path}`);
                }
                // Start download if path exists
                const link = document.createElement('a');
                link.href = title;
                link.download = title;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => {
                // Display error to the user
                console.error(error.message);
                alert(`Error: ${error.message}`);
            });
    }
});

// Function to generate year bars
function generateYearBarHTML(year) {
    return `<div class="year-divider"><strong>${year}</strong></div>`;
}

// Function to render publications
function renderPublications() {
    const container = document.querySelector('.publications');
    let currentYear = null;
    // Call the function to update publicationsData:
    const pathToFile = 'assets/publications.json'; 
    let publicationsData;
    parseLocalJSONFile(pathToFile)
    .then(jsonData => {
        publicationsData = jsonData;
        // Print out:
        for (i in publicationsData) {
            const publication = publicationsData[i]
            if (publication.year !== currentYear) {
                container.innerHTML += generateYearBarHTML(publication.year);
                currentYear = publication.year;
            }
            container.innerHTML += generatePublicationHTML(publication);
        }

    });

    
}

// Call the function to render publications
if (window.location.href.includes('publications.html')) {
    renderPublications();
}