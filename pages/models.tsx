import { Card, Text } from "@nextui-org/react";
import { useEffect, useState } from "react";
import apiClient from "../utils/client/api-client";

const Models = () => {
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      const models = await apiClient.getModels();
      const modelsData = await models.json();
      setModels(modelsData.models);
      console.log(modelsData.models);
    };
    fetchModels();
  }, []);
  return (
    <div style={{ maxWidth: 600, padding: 32 }}>
      {models.map((model) => (
        <Card style={{ marginBottom: 5 }}>
          <Card.Body>
            <Text>{model.id}</Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Models;
