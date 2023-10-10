import React from "react";
import { Card, CardBody, CardHeader, Divider, CardFooter } from "@nextui-org/react";

type ControlDataCardProps = {
    title: string;
    processVariableValue: number;
    processVariable: string;
    setPoint: number;
    output: number;
    mode: "AUTO" | "MANUAL" | "JOGGING";
}

export const ControlDataCard: React.FC<ControlDataCardProps> = ({ title, processVariable, processVariableValue, setPoint, output, mode }) => {
    return (
        <Card className="bg-nav-button-fg  border border-nav-button-border rounded-none min-w-[120px] max-w-[180px] min-h-[80px] max-h-[230px]" radius="none">
            <CardHeader className="flex gap-0 p-1">
                <div className="flex flex-col">
                    <p className="text-xs">{title}</p>
                </div>
            </CardHeader>
            <Divider className="bg-separator-line" />
            <CardBody className="p-1">
                <div className="flex flex-col gap-0">
                    <p className="text-xs"> PV <span className="text-data-fg font-bold">{processVariableValue}</span> {processVariable}</p>
                    <p className="text-xs"> SP <span className="text-label-fg font-bold">{setPoint}</span></p>
                    <p className="text-xs"> O <span className="text-data-fg font-bold">{output}</span> %</p>
                </div>

            </CardBody>
            <Divider className="bg-separator-line" />
            <CardFooter className="p-1">
                <div className="flex flex-col">
                    <p className="text-xs text-data-fg font-bold">{mode}</p>
                </div>
            </CardFooter>
        </Card>
    );
}