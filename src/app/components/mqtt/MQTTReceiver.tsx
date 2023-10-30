import React, { useState, useEffect } from 'react';
import { MqttClient } from 'mqtt';
import * as mqtt from "mqtt"; // import everything inside the mqtt module and give it the namespace "mqtt"

const MQTTReceiver: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [client, setClient] = useState<MqttClient | null>(null);

  useEffect(() => {
    // Connect to the MQTT broker
    const mqttClient = mqtt.connect('mqtt://187.170.220.174:9001', {protocol: "ws"});

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT Broker');
      mqttClient.subscribe('Test');
    });

    mqttClient.on('message', (topic, payload) => {
      console.log(`Received message on ${topic}: ${payload.toString()}`);
      setMessage(payload.toString());
    });

    // Set the client instance to state
    setClient(mqttClient);

    // Clean up the connection when component is unmounted
    return () => {
      mqttClient.end();
    };
  }, []);

  return (
    <div className="">
      <h3 className='text-slate-950'>Received MQTT Message:</h3>
      <p className='text-slate-950'>{message}</p>
    </div>
  );
};

export default MQTTReceiver;
