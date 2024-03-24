import { useEffect, useState, } from 'react';
import { Button, InputNumber } from 'antd';
import { Input } from 'antd';
import errorsHandler from './ErrorsHandler';

function Tools() {
    const [toolData, setToolData] = useState()
    const [toolCount, setToolCount] = useState()
    const [toolName, setToolName] = useState()

    useEffect(() => { getTools() }, [])
    const content = toolData === undefined
        ? <h1>Данне загружаются</h1>
        : <div>
            <table>
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Количество</th>
                        <th>Действие</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <Input placeholder="Введите название" onChange={(value) => setToolName(value.target.value)} />
                        </td>
                        <td>
                            <InputNumber min={1}  defaultValue={0} onChange={(value) => setToolCount(value)} /><br />
                        </td>
                        <td>
                            <Button onClick={addTool}>Добавить</Button>
                        </td>
                    </tr>
                    {toolData.map(item => {
                        return <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.count}</td>
                            <td><Button onClick={() => deleteTool(item.id)}>Удалить</Button></td>
                        </tr>
                    })}

                </tbody>
            </table>

        </div>


    async function getTools() {
        const response = await fetch('http://localhost:8000/tool');
        const data = await response.json();
        setToolData(data)
    }
    async function addTool() {
        if (toolCount == 0) {
            alert("Введите количество инструментов")
            return
        }

        const response = await fetch('http://localhost:8000/tool', {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ Name: toolName,Count:toolCount })
        })
        errorsHandler(response.status, getTools)


    }
    async function deleteTool(id) {
        const response = await fetch(`http://localhost:8000/tool/${id}`,
            { method: 'DELETE' })
        errorsHandler(response.status, getTools)

    }


    return <div>
        {content}
    </div>
}
export default Tools;