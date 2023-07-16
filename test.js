import { CloudUploadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Layout, Row, Typography, Input } from 'antd';
import TaskTable from './components/TaskTable';
import { TaskContext } from '../../../context/TaskContext';
import { useCallback, useContext, useEffect, useState } from 'react';

import ImportTaskPopUp from './components/ImportTaskPopUp';
import { ITask } from '../../utils/types';
import Footer from '../Others/Footer';


const { Title } = Typography;
const { Search } = Input;

type JobsProps = {
    onBreadClick: () => void,
    onAddTaskClick: () => void,
    onTaskEditClick: () => void
}
const Task = (props: JobsProps) => {

    const { onBreadClick, onAddTaskClick, onTaskEditClick } = props;
    const { setOneTask, tasks } = useContext(TaskContext);

    const handleAddTask = () => {
        setOneTask(null);
        onAddTaskClick();
    };

    const [modalOpen, setModalOpen] = useState(false);

    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState<ITask[]>(tasks);

    const onSearch = useCallback((value: string) => {
        setSearchValue(value);
        if (value === '') {
            setSearchResult(tasks);
            return;
        }
        const temp: ITask[] = tasks.filter((item: ITask) => {
            return (
                item.area.toLowerCase().includes(value.toLowerCase()) ||
                item.task.toLowerCase().includes(value.toLowerCase()) ||
                item?.client?.name.toLowerCase().includes(value.toLowerCase()) ||
                item?.site?.siteName.toLowerCase().includes(value.toLowerCase())    
            );
        });
        setSearchResult(temp);
    }, [tasks]);

    useEffect(() => {
        onSearch(searchValue);
    }, [onSearch, searchValue]);



    return (
        <>
            <ImportTaskPopUp open={modalOpen} openPopup={setModalOpen} />
            <Layout className='report-card'>
                <div className='header-row'>
                    <div className=" header-col">
                        <div className="breadcrumb">
                            <Title level={2}>Default Task List</Title>
                            <Breadcrumb>
                                <Breadcrumb.Item onClick={onBreadClick}>Dashboard</Breadcrumb.Item>
                                <Breadcrumb.Item className='bread-active'>Default Task List</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <div className='btn-con btn-show-md'>
                            <Button className='view-btn' onClick={handleAddTask}><PlusCircleOutlined size={24} />Add Task</Button>
                        </div>
                    </div>
                    <div className="header-col">
                        <Search
                            className="search-bar"
                            placeholder="Search by area or task or client or sitename"
                            onSearch={onSearch}
                            enterButton
                            value={searchValue}
                            onChange={(e) => { return setSearchValue(e.target.value); }}
                        />
                        <div className='btn-con btn-show-lg'>
                            <Button className='view-btn' onClick={handleAddTask}><PlusCircleOutlined size={24} />Add Task</Button>
                        </div>
                    </div>
                </div>
                <Row>
                    <TaskTable data={searchResult} onTaskEditClick={onTaskEditClick} />
                </Row>
                <div className='header-row'>
                    <div className="header-col" style={{
                        'display': 'flex',
                        'alignItems': 'center',
                        'gap': '2rem',
                        'justifyContent': 'flex-end',
                    }}>
                        <h4>Download the csv template for task list <a href='./task_list_template.csv' download>from here</a></h4>
                        <Button className='view-btn' onClick={() => { return setModalOpen(true); }}>
                            <CloudUploadOutlined size={24} />
                            Import
                        </Button>
                    </div>
                </div>

                <Footer />

            </Layout>
        </>
    );
};

export default Task;