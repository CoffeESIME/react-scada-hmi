import React from "react";
import { Card, CardBody } from "@nextui-org/react";

type CardDataProps = {
    info: string;
}

export const CardData: React.FC<CardDataProps> = ({ info }) => {
    return (
        <Card className="bg-nav-button-fg  border-2 border-nav-button-border">
            <CardBody>
                <p>{info}</p>
            </CardBody>
        </Card>
    );
}
