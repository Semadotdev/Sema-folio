# Franklin Baker WMS & Baktag

A warehouse management system and baktag utility for Franklin Baker, designed to streamline inventory tracking and tag management.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | PHP 7.4+ |
| Database | MySQL / MariaDB |
| Server | Apache |
| Printing | BarTender (custom protocol integration) |

## Features

- Real-time inventory tracking and stock movement logging
- Automated baktag generation and label printing
- Zero-click BarTender printing via custom protocol
- Report generation for warehouse audits
- Role-based access (Employee, Super Admin)

## Project Structure

```
├── wms_fbcop/     Core WMS application
├── baktag/        Tagging and labeling subsystem
└── index.php      Main entry point / dashboard
```
