<p align="center">
  <img src="https://img.shields.io/badge/SCADA-HMI-2563eb?style=for-the-badge&logo=react&logoColor=white" alt="SCADA HMI"/>
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0.4-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/MQTT-Real--time-52b788?style=for-the-badge&logo=eclipse-mosquitto" alt="MQTT"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="MIT License"/>
</p>

<h1 align="center">🏭 React SCADA HMI — Frontend</h1>

<p align="center">
  <strong>A modern, web-based SCADA/HMI system for real-time industrial process monitoring and control</strong>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-components">Components</a> •
  <a href="#-features">Features</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-backend">Backend</a>
</p>

---

## 📋 Overview

React SCADA HMI is the **frontend layer** of an industrial monitoring system. It provides a drag-and-drop interface to build custom HMI dashboards with live data streaming via MQTT. Screens are persisted in the backend and can be loaded dynamically by slug.

> ⚙️ This frontend is designed to work with [scada-backend](https://github.com/your-org/scada-backend). See the [Backend section](#-backend) for the full API reference.

---

## 📸 Screenshots

> 💡 *Replace the placeholders below with actual screenshots of your deployment.*

### HMI Dashboard Builder
<!-- Screenshot: drag-and-drop canvas showing industrial components connected by pipes/lines -->
![HMI Dashboard Builder](docs/screenshots/dashboard-builder.png)

### Real-time Process View
<!-- Screenshot: live SCADA screen with tank levels, valve states and motor status updating in real-time -->
![Real-time Process View](docs/screenshots/realtime-view.png)

### Data Trend Chart
<!-- Screenshot: ApexCharts time-series chart with multiple tag trends, setpoints and alarm thresholds -->
![Data Trend Chart](docs/screenshots/data-trend.png)

### Alarm Panel
<!-- Screenshot: priority-based alarm list with ISA-101 color coding (purple/yellow/orange/red) -->
![Alarm Panel](docs/screenshots/alarm-panel.png)

### Tag Manager
<!-- Screenshot: table listing all configured tags, protocols, scan rates and enable/disable toggles -->
![Tag Manager](docs/screenshots/tag-manager.png)

> 📁 Place screenshots in `docs/screenshots/` and commit them to the repo.

---

## 🧩 Industrial HMI Components

All components receive live data via MQTT and follow the **ISA-101 HMI Design Guidelines**.

| Component | Description | Props |
|-----------|-------------|-------|
| **Tank** | Vessel with animated fill level (blue scheme) | `level`, `min`, `max`, `unit`, `alarmHigh`, `alarmLow` |
| **Valve (Round)** | Circular valve showing Open/Closed/Fault state | `state: 'open' \| 'closed' \| 'fault'`, `label` |
| **Valve (Rect)** | Rectangular gate valve indicator | `state`, `label`, `tagId` |
| **Motor / Pump** | Motor status with running/stopped/fault states | `running`, `fault`, `rpm`, `label` |
| **LinearGauge** | Vertical gauge with setpoint and HH/H/L/LL limits | `value`, `min`, `max`, `setpoint`, `alarms` |
| **DataTrend** | Full historical trend chart (D3.js + ApexCharts) | `tagIds`, `timeRange`, `showSetpoint` |
| **SmallDataTrend** | Compact sparkline for inline display | `tagId`, `points` |
| **ControlDataCard** | PID display (PV / SP / Output / Mode) | `pv`, `sp`, `output`, `mode: 'AUTO' \| 'MAN'` |
| **Alarm** | Priority badge with ISA-101 color | `priority: 'low' \| 'medium' \| 'high' \| 'urgent'`, `message` |
| **Label** | Annotation text label | `text`, `size`, `color` |
| **Button** | Navigation or action trigger | `label`, `href`, `onClick` |
| **Box** | Grouping container / area | `title`, `color` |

### Alarm Color System (ISA-101)

| Priority | Color | Hex | Use Case |
|----------|-------|-----|----------|
| 🟣 Low | Purple | `#916AAD` | Minor deviation |
| 🟡 Medium | Yellow | `#F5E11B` | Requires attention |
| 🟠 High | Orange | `#EC8629` | Immediate action |
| 🔴 Urgent | Red | `#E22028` | Critical — act now |

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔴 **Real-time Data** | MQTT/WebSocket integration — tags update without polling |
| 🖱️ **Drag & Drop Builder** | ReactFlow canvas to build and wire SCADA screens |
| 💾 **Screen Persistence** | Screens are saved to/loaded from the backend by slug |
| 📊 **Advanced Charts** | Historical trends with D3.js, ApexCharts and Plotly |
| 🎨 **ISA-101 Compliant** | Standardized colors for alarm states and equipment status |
| ✍️ **Tag Write / Control** | Send setpoints or commands back to the backend via REST |
| ☁️ **Cloud Ready** | Terraform AWS (EC2) infrastructure + GitHub Actions CI/CD |
| 🗃️ **Zustand State** | Centralized store for MQTT client, tags and screen state |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.0.4 |
| State | Zustand 4.4.3 |
| Diagrams | ReactFlow 11.9.2 |
| Charts | D3.js 7 · ApexCharts 3 · Plotly.js 2 |
| Messaging | MQTT.js 5.1.3 (WebSocket) |
| Styling | Tailwind CSS · NextUI |
| HTTP Client | Axios |
| Infra | Terraform (AWS EC2) |
| CI/CD | GitHub Actions → PM2 |

---

## 🚀 Installation

### Prerequisites
- **Node.js** >= 18.x
- **MQTT Broker** running (Mosquitto on `localhost:9001` WS)
- **scada-backend** running (on `localhost:8888`)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/react-scada-hmi.git
cd react-scada-hmi

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_MQTT_URL=ws://localhost:9001
# NEXT_PUBLIC_API_URL=http://localhost:8888

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev         # Development server
npm run build       # Production build
npm run start       # Start production server
npm run lint        # ESLint
npm run format      # Prettier check
npm run format:fix  # Prettier auto-fix
```

---

## ⚙️ Backend

This frontend consumes the **scada-backend** REST API and MQTT topics. See the [scada-backend repository](https://github.com/your-org/scada-backend) for full API docs.

### MQTT Topics consumed by the frontend

| Topic | Direction | Payload |
|-------|-----------|---------|
| `scada/tags/{tag_name}` | Backend → Frontend | `{ tag_id, tag_name, value, timestamp, quality }` |
| `scada/alarms/{severity}` | Backend → Frontend | `{ tag_id, message, threshold, value }` |

### Key API calls made by the frontend

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/tags/` | Load tag list for the Tag Manager |
| `GET` | `/api/v1/tags/{id}` | Load a single tag detail |
| `POST` | `/api/v1/tags/{id}/write` | Send a write command (setpoint, valve, etc.) |
| `GET` | `/api/v1/screens/` | List available SCADA screens |
| `GET` | `/api/v1/screens/home` | Load the default home screen |
| `GET` | `/api/v1/screens/{slug}` | Load a specific screen layout |
| `POST` | `/api/v1/screens/` | Save a new screen from the builder |
| `PUT` | `/api/v1/screens/{id}` | Save/update an existing screen |
| `GET` | `/api/v1/history` | Fetch historical data for trend charts |
| `GET` | `/api/v1/history/latest/{tag_id}` | Fetch latest N records for a sparkline |

---

## ☁️ Deployment (AWS)

```bash
cd infra
terraform init
terraform plan
terraform apply
```

GitHub Actions deploys automatically on push to `main`:
1. Builds Next.js production bundle
2. Copies `.next/` to EC2 via SCP
3. Restarts with PM2

**Required GitHub Secrets:** `SSH_PRIVATE_KEY`, `EC2_IP_ADDRESS`

---

## 📄 License

MIT © 2026 Fabian — see [LICENSE](LICENSE)