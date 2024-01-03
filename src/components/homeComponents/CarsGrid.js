"use client";
import { Row, Col } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

function CarsGrid({ cars }) {
  const router = useRouter();
  return (
    <Row gutter={[16, 16]}>
      {cars.map((car) => (
        <Col span={6} key={car._id}>
          <div
            className="card p-3 h-100 cursor-pointer"
            onClick={() => {
              router.push(`/cars/${car._id}`);
            }}
          >
            <img src={car.carImage} alt={car.name} width="100%" />
            <div className="divider"></div>
            <div className="p-3">
              <h3 className="text-md">{car.name}</h3>
              <h6 className="text-sm my-1">{car.brand}</h6>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
}

export default CarsGrid;
