document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.getElementById('report-form');
    const percentageSlider = document.getElementById('progress-percentage');
    const percentageLabel = document.getElementById('percentage-label');

    // Update percentage label on slider change
    percentageSlider.addEventListener('input', () => {
        percentageLabel.textContent = percentageSlider.value;
    });

    reportForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Get form data
        const projectName = document.getElementById('project-name').value;
        const weekNumber = document.getElementById('week-number').value;
        const progressPercentage = document.getElementById('progress-percentage').value;
        const progressDescription = document.getElementById('progress-description').value;
        
        const logoFile = document.getElementById('company-logo').files[0];
        const imageFiles = document.getElementById('project-images').files;

        if (imageFiles.length > 3) {
            alert('Por favor, sube un máximo de 3 imágenes de avance.');
            return;
        }

        // Read files as Base64
        const logoBase64 = logoFile ? await readFileAsDataURL(logoFile) : null;
        const imagesBase64 = await Promise.all(Array.from(imageFiles).map(file => readFileAsDataURL(file)));

        // Generate and display report
        const reportHtml = generateReportHTML(projectName, weekNumber, progressPercentage, progressDescription, logoBase64, imagesBase64);
        
        const reportWindow = window.open();
        reportWindow.document.write(reportHtml);
        reportWindow.document.close();
    });

    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function generateReportHTML(projectName, week, percentage, description, logo, images) {
        const imageGrid = images.map(img_src => `
            <div class="col-md-4">
                <img src="${img_src}" class="img-fluid rounded mb-3" alt="Imagen de avance">
            </div>`).join('');

        const logoHtml = logo ? `<img src="${logo}" alt="Logo" style="max-height: 80px; margin-bottom: 20px;">` : '';

        return `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Reporte de Avance: ${projectName}</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { padding: 40px; }
                    .report-header { text-align: center; margin-bottom: 40px; }
                    @media print {
                        body { -webkit-print-color-adjust: exact; }
                        .btn { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="report-header">
                        ${logoHtml}
                        <h1>Reporte de Avance Semanal</h1>
                        <h2>${projectName} - Semana N° ${week}</h2>
                    </div>

                    <div class="card mb-4">
                        <div class="card-header">Resumen del Proyecto</div>
                        <div class="card-body">
                            <p><strong>Porcentaje de Avance:</strong> ${percentage}%</p>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" style="width: ${percentage}%;" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                    </div>

                    <div class="card mb-4">
                        <div class="card-header">Descripción de Tareas y Avances</div>
                        <div class="card-body">
                            <p style="white-space: pre-wrap;">${description}</p>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">Registro Fotográfico</div>
                        <div class="card-body">
                            <div class="row">${imageGrid}</div>
                        </div>
                    </div>
                    
                    <div class="text-center mt-4">
                        <button class="btn btn-primary" onclick="window.print()">Imprimir o Guardar como PDF</button>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
});
