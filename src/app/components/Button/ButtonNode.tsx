import { CustomButton } from "./Button";
import { NodeProps } from 'reactflow';
import React, { useEffect, useState } from "react"
import { useNodeStore } from "@/app/store/nodes";
interface CustomButtonData {
    label: string;
}

type CustomButtonNodeProps = NodeProps & {
    data: CustomButtonData
}

export const ButtonNode: React.FC<CustomButtonNodeProps> = ({ data }) => {
    let action1 = useNodeStore((store)=> store.updateAlarmsOn)
    let action2 = useNodeStore((store)=> store.updateAlarmsOff)
    const [handleAction, setHandleAction] = useState<()=>void>(()=>action1)

    useEffect(()=>{
        if(data.label =="set Alarms On"){
            setHandleAction(()=>action1)
        }
        if(data.label =="set Alarms Off"){
            setHandleAction(()=>action2)
        }

    }, [data.label])
    return <CustomButton handlePress={handleAction} label={data.label} />
}