import React from "react";
import { Card, CardBody } from "@nextui-org/react";

type CardDataProps = {
    label: string[];
}

export const CardData: React.FC<CardDataProps> = ({ label }) => {
    return (
        <Card className="bg-nav-button-fg border-2 border-nav-button-border min-w-[120px] max-w-[180px] min-h-[80px] max-h-[230px]">
            <CardBody className="p-1 flex flex-col justify-center items-center">
                <div className="flex flex-col gap-0">
                    {label.map((strEl, index) => (
                        <p key={index} className="text-small">{strEl}</p>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}
