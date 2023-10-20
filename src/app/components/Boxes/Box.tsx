import React from "react";
import { Card, CardBody } from "@nextui-org/react";


export const BoxCard: React.FC = ({ }) => {
    return (
        <Card className="bg-transparent border-2 border-nav-button-border w-80 h-80">
            <CardBody className="p-1 flex flex-col justify-center items-center">
                <div className="flex flex-col gap-0">
                </div>
            </CardBody>
        </Card>
    );
}
