import { Col, Row } from "antd"
import { TableComponent } from "./components/table/TableComponent"
import "./scss/App.scss"
import Map from "./components/map/Map"

function App() {
  return (
    <div className="App">
      <Row gutter={[16, 8]}>
        <Col span={12}>
          <TableComponent />
        </Col>
        <Col span={12}>
          <Map />
        </Col>
      </Row>

      <h1>Hello</h1>
    </div>
  )
}

export default App
