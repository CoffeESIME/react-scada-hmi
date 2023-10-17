import React, { useState, useEffect } from "react"

interface AlarmProps {
    isActive?: boolean;
    type?: "LOW" | "HIGH" | "MEDIUM" | "URGENT";
    message?: string;
    size?: number;
}

export const Alarm: React.FC<AlarmProps> = ({ size = 20, isActive = true, type }) => {
    const [alarmColor, setAlarmColor] = useState<string>('#FFFFFF')
    useEffect(() => {
        switch (type) {
            case "LOW":
                setAlarmColor("#FFFFFF")
                break;
            case "MEDIUM":
                setAlarmColor("#F5E11B")
                break;
            case "HIGH":
                setAlarmColor("#EC8629")
            case "URGENT":
                setAlarmColor("#E22028")
                break;
            default:
                break;
        }
    }, [type])
    return (<>

        {isActive && <svg width={`${size}px`} height={`${size}px`} viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="Output-svg" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="out" transform="translate(-597.000000, -105.000000)" fill={alarmColor}>
                    <path d="M618.12928,126 L599.87072,126 C599.11302,126 598.788053,125.485645 599.144881,124.851175 L608.353902,108.475853 C608.710729,107.841382 609.289271,107.841382 609.646054,108.475853 L618.855119,124.851175 C619.211947,125.485645 618.88698,126 618.12928,126 Z M608,114 L610,114 L610,116.46516 L609.482428,121 L608.530351,121 L608,116.46516 L608,114 Z M608,122 L610,122 L610,124 L608,124 L608,122 Z" id="path">
                    </path>
                </g>
            </g>
        </svg>}
    </>)
}