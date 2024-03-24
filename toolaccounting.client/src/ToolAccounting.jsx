import { useEffect, useState } from "react";
import { Button, Select } from "antd";
import { InputNumber } from "antd";
import "./css/bootstrap.min.css";

function ToolAccounting() {
  const [toolaccounting, setToolaccounting] = useState([]);
  const [userFullName, setUserFullName] = useState();
  const [tools, setTools] = useState();
  const [toolsCount, setToolsCount] = useState(1);
  const [selectedtool_count, setSelectedtool_count] = useState(1);
  const [selectedFullName, setSelectedFullName] = useState();
  const [selectedTool, setSelectedTool] = useState();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    getData();
  }, []);
  const content =
    toolaccounting === undefined ? (
      <h1>Данные загружаются</h1>
    ) : (
      <div>
        <div className="d-flex align-items-start">
          <Button type="primary" onClick={renderRowForPost}>
            Добавить
          </Button>
        </div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Наименование инструмента</th>
              <th>Инструментов у сотрудника</th>
              <th>ФИО пользователя</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {toolaccounting.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.tool.name}</td>
                  <td>{item.tool_count}</td>
                  <td>{item.user.full_name}</td>
                  <td>
                    <InputNumber
                      min={1}
                      max={item.tool_count}
                      defaultValue={item.delCount}
                      onChange={(value) => handleDeleteCount(item.id, value)}
                    />
                    <Button onClick={() => handleDelete(item.id)}>
                      Удалить
                    </Button>
                  </td>
                </tr>
              );
            })}
            {isVisible ? (
              <tr>
                <td>
                  {tools ? (
                    <Select
                      defaultValue="Выберите инструмент"
                      onChange={handleSelectedTool}
                      style={{
                        width: 200,
                      }}
                      options={tools.map((item) => {
                        return { value: item.id, label: item.name };
                      })}
                    />
                  ) : (
                    "Загружаю инструменты"
                  )}
                </td>
                <td>
                  <InputNumber
                    className="ms-4"
                    min={1}
                    max={selectedtool_count}
                    defaultValue={1}
                    onChange={(value) => setToolsCount(value)}
                  />
                  <br />
                  Остаток на складе: {selectedtool_count}
                </td>
                <td>
                  {userFullName ? (
                    <Select
                      defaultValue="Выберите сотрудника"
                      onChange={setSelectedFullName}
                      style={{
                        width: 250,
                      }}
                      options={userFullName.map((item) => {
                        return { value: item.id, label: item.full_name };
                      })}
                    />
                  ) : (
                    "Загружаю список"
                  )}
                </td>
                <td>
                  <Button
                    type="primary"
                    style={{ marginRight: "10px" }}
                    onClick={sendNewToolAccountingRow}
                  >
                    Сохранить
                  </Button>
                  <Button danger onClick={cancel}>
                    Отмена
                  </Button>
                </td>
              </tr>
            ) : (
              ""
            )}
          </tbody>
        </table>
      </div>
    );

  return <div>{content}</div>;

  async function getData() {
    const response = await fetch("http://localhost:8000/accounting/");
    const data = await response.json();
    renderRow(data);

    const responseUser = await fetch("http://localhost:8000/user");
    const dataUser = await responseUser.json();
    setUserFullName(dataUser);

    const responseTools = await fetch("http://localhost:8000/tool/toolforac");
    const dataTools = await responseTools.json();
    setTools(dataTools);
  }

  function renderRow(data) {
    const newData = data.map((item) => {
      return { ...item, delCount: 1 };
    });
    setToolaccounting(newData);
  }
  
  async function renderRowForPost() {
    setIsVisible(!isVisible);

    if (isVisible) {
      const response = await fetch("http://localhost:8000/tool/toolforac");
      const data = await response.json();
      setTools(data);
    }
  }

  function cancel() {
    setIsVisible(false);
  }

  async function sendNewToolAccountingRow() {
    if (selectedTool == undefined) {
      alert("Выберите инструмент");
      return;
    }
    if (selectedFullName == undefined || selectedFullName == 0) {
      alert("Выберите сотрудника");
      return;
    }

    let row = {};
    let tool = selectedTool;
    if (tool == 0) {
      alert("Выберите инструмент");
      return;
    }

    row["ToolId"] = tool;
    row["UserId"] = selectedFullName;
    row["tool_count"] = toolsCount;

    const response = await fetch("http://localhost:8000/accounting/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(row),
    });

    if (response.status == 200) {
      getData();
      renderRowForPost();
      setIsVisible(false);
    }
  }
  async function handleDelete(itemId) {
    let dataToFetch = {};
    toolaccounting.filter((item) => {
      if (item.id == itemId) {
        dataToFetch = item;
        return item;
      }
      return false;
    });

    const response = await fetch(
      `http://localhost:8000/accounting/${dataToFetch["id"]}/${dataToFetch["delCount"]}`,
      { method: "DELETE" }
    );

    if (response.status == 200) {
      getData();
      setIsVisible(false);
    }
  }

  function handleDeleteCount(id, count) {
    const newData = toolaccounting.map((item) => {
      if (item.id == id) {
        return { ...item, delCount: count };
      }
      return item;
    });

    setToolaccounting(newData);
  }
  
  function handleSelectedTool(id) {
    let tool_count = 0;
    tools.filter((item) => {
      if (item.id == id) tool_count = item.count;
    });
    setSelectedtool_count(tool_count);
    setSelectedTool(id);
  }
}

export default ToolAccounting;
