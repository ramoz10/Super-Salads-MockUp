import React, { useRef } from 'react';
import { Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const ExcelUploader = ({ onUpload, ingredients = [] }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                onUpload(data);
            };
            reader.readAsBinaryString(file);
        }
    };

    const downloadTemplate = (e) => {
        e.stopPropagation();

        // Crear plantilla con los ingredientes reales de la base de datos
        // Cada ingrediente aparece con cantidad 0 para que el usuario solo modifique las cantidades
        const templateData = ingredients.length > 0
            ? ingredients.map(ingredient => ({
                Nombre: ingredient.name,
                Unidad: ingredient.unit,
                Cantidad: 0
            }))
            : [
                // Fallback si no hay ingredientes cargados
                { Nombre: 'Ejemplo Ingrediente 1', Unidad: 'kg', Cantidad: 0 },
                { Nombre: 'Ejemplo Ingrediente 2', Unidad: 'pz', Cantidad: 0 },
                { Nombre: 'Ejemplo Ingrediente 3', Unidad: 'L', Cantidad: 0 }
            ];

        // Crear workbook y worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(templateData);

        // Establecer anchos de columna
        ws['!cols'] = [
            { wch: 30 }, // Nombre
            { wch: 12 }, // Unidad
            { wch: 12 }  // Cantidad
        ];

        // Agregar worksheet al workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Pedido');

        // Generar y descargar archivo
        const fileName = ingredients.length > 0
            ? 'Plantilla_Pedido_SuperSalads.xlsx'
            : 'Plantilla_Pedido_SuperSalads_Ejemplo.xlsx';
        
        XLSX.writeFile(wb, fileName);
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '0.75rem' 
            }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Carga Rápida desde Excel</h3>
                <button
                    onClick={downloadTemplate}
                    className="btn-primary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.5rem 0.85rem',
                        fontSize: '0.85rem'
                    }}
                >
                    <Download size={16} />
                    Descargar Plantilla
                </button>
            </div>

            <div
                className="card"
                style={{
                    border: '2px dashed var(--border)',
                    backgroundColor: 'var(--background)',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    gap: '1rem'
                }}
                onClick={() => fileInputRef.current.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept=".xlsx, .xls"
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <Upload size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ 
                            fontWeight: 500, 
                            margin: 0, 
                            fontSize: '0.9rem',
                            marginBottom: '0.25rem'
                        }}>
                            Cargar pedido desde Excel
                        </p>
                        <p style={{ 
                            fontSize: '0.8rem', 
                            color: 'var(--text-secondary)', 
                            margin: 0 
                        }}>
                            Arrastra o haz clic • Formato: Nombre, Unidad, Cantidad
                        </p>
                        {ingredients.length > 0 && (
                            <p style={{ 
                                fontSize: '0.75rem', 
                                color: 'var(--primary)', 
                                marginTop: '0.25rem', 
                                fontWeight: 500,
                                margin: 0
                            }}>
                                {ingredients.length} ingrediente{ingredients.length !== 1 ? 's' : ''} disponible{ingredients.length !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExcelUploader;
