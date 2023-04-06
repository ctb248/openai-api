import { useState, useContext, useEffect, useMemo } from "react";
import Select from "react-select";

import { AppContext } from "../../pages/_app";
import apiClient from "../../utils/client/api-client";

interface Option {
  label: string;
  value: string;
}

const sortById = (a, b): number => {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
};

const SelectModel = () => {
  const {
    state: { model },
    updateGlobalState,
  } = useContext(AppContext);
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      const data = await apiClient.getModels();
      const { models: modelsArr } = await data.json();

      modelsArr.sort(sortById);
      setModels(modelsArr);
      console.log(modelsArr);
    };
    fetchModels();
  }, []);

  const handleChange = (option: Option) => {
    updateGlobalState({ model: option.value });
  };

  const options: Option[] = useMemo(
    () => models.map((model) => ({ value: model.id, label: model.id })),
    [models]
  );

  return (
    <div>
      <label
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          marginBottom: 3,
          letterSpacing: 2,
          display: "block",
          textAlign: "center",
        }}
      >
        Model
      </label>
      <Select
        className="basic-single"
        classNamePrefix="select"
        value={{ value: model, label: model }}
        onChange={handleChange}
        isSearchable={true}
        name="model"
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            minWidth: 250,
          }),
        }}
        options={options}
      />
    </div>
  );
};

export default SelectModel;
