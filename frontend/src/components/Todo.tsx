import { Button, Checkbox, Spinner } from '@material-tailwind/react'
import { useDispatch, useSelector } from "react-redux";
import { useAddTodoMutation, useDeleteTodoMutation, useGetTodosQuery, useUpdateTodoMutation } from "../redux/todosApi";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input
} from "@material-tailwind/react";
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../redux/stateReducers/userReducer';
function Todo() {
    const token = localStorage.getItem("user_token")
    const currentUser = useSelector((state: any) => state.user);
    const { data, refetch, error }: any = useGetTodosQuery(currentUser.id, { skip: !currentUser.id || !token });
    const [deleteTodoMutation] = useDeleteTodoMutation();
    const [updateTodoMutation, { isLoading }] = useUpdateTodoMutation();
    const [title, setTitle] = useState<string>()
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);
    const [addTodo] = useAddTodoMutation();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        if (currentUser != null) {
            if (error?.status == 401) {
                navigate("/login")
            }
        }
    }, [error?.status])
    const handleSave = () => {
        if (title) {
            handleOpen()
            const newTodo: Todo = {
                title,
                id: uuidv4(),
                user_id: currentUser.id
            }
            addTodo(newTodo)
            setTitle("")

            setTimeout(() => {
                refetch();
            }, 200);
        }
    }
    const removeItem = (id: string) => {
        deleteTodoMutation({ id, user_id: currentUser.id });
        setTimeout(() => {
            refetch();
        }, 200);
    }
    const updateItemCompleted = async (checked: boolean, item: any) => {
        try {
            await updateTodoMutation({
                id: item.id,
                data: { title: item.title, completed: checked, user_id: currentUser.id },
            });
            setTimeout(() => {
                refetch();
            }, 200);
        } catch (error) {
            // Handle error
        }
    }
    const titleInputChange = async (value: string, item: any) => {
        try {
            const newItem = { ...item, title: value }
            setTimeout(() => {
                updateItem(newItem);
            }, 1000)
        } catch (error) {
            // Handle error
        }
    }
    const updateItem = async (item: any) => {
        await updateTodoMutation({
            id: item.id,
            data: { title: item.title, completed: item.completed, user_id: currentUser.id },
        });
        setTimeout(() => {
            refetch();
        }, 200);
    }

    const sortedTodos = data?.todos?.slice().sort((a: any, b: any) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);

        if (dateA > dateB) {
            return -1;
        } else if (dateA < dateB) {
            return 1;
        } else {
            return 0;
        }
    });
    const logOut = () => {
        localStorage.clear()
        navigate("/login")
        dispatch(clearUser())
    }
    return (
        <>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Add new todo</DialogHeader>
                <DialogBody divider>
                    <Input color="teal" onChange={(e) => setTitle(e.target.value)} value={title} crossOrigin={"*"} label='Title' />
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={handleSave}>
                        <span>Save</span>
                    </Button>
                </DialogFooter>
            </Dialog>
            <div className="w-full flex items-center  justify-center h-screen">
                <div className="bg-[#2C2729] w-[490px] h-[620px] rounded-xl relative shadow-2xl p-9">
                    <button onClick={logOut} className='absolute top-2.5 right-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 1568 1280"><path fill="white" d="M640 1184q0 4 1 20t.5 26.5t-3 23.5t-10 19.5t-20.5 6.5H288q-119 0-203.5-84.5T0 992V288Q0 169 84.5 84.5T288 0h320q13 0 22.5 9.5T640 32q0 4 1 20t.5 26.5t-3 23.5t-10 19.5T608 128H288q-66 0-113 47t-47 113v704q0 66 47 113t113 47h312l11.5 1l11.5 3l8 5.5l7 9l2 13.5zm928-544q0 26-19 45l-544 544q-19 19-45 19t-45-19t-19-45V896H448q-26 0-45-19t-19-45V448q0-26 19-45t45-19h448V96q0-26 19-45t45-19t45 19l544 544q19 19 19 45z" /></svg>
                    </button>

                    <div className="w-full bg-white h-full p-2.5 text-center">
                        <div className="w-full flex items-center justify-between text-center">
                            <span className="font-semibold text-2xl">To Do List</span>
                            <Button onClick={handleOpen} color='green' className='p-2'>New Todo +</Button>
                        </div>
                        <div className="h-[calc(100%-30px)] overflow-y-auto px-2 mt-1">
                            {
                                sortedTodos?.map((item: any, index: number) => <div key={item.id} className="flex items-end gap-5 justify-between mt-9">
                                    <div className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs">{index + 1}</div>
                                    <div className="w-[calc(100%-38px)] h-0.5 bg-black relative">
                                        <div className="flex w-full absolute left-0 right-0 bottom-[100%]">
                                            <input type="text" className="outline-none w-full mr-1" defaultValue={item.title} onChange={(e) => titleInputChange(e.target.value, item)} />
                                            {isLoading ?
                                                <Spinner className="mb-0.5" />
                                                :
                                                <button onClick={() => removeItem(item.id)}>
                                                    <svg style={{ color: 'red' }} xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" fill="red" /> <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" fill="red" /> </svg>
                                                </button>
                                            }
                                        </div>
                                    </div>
                                    <label className="w-fit min-w-[26px] h-6  cursor-pointer select-none flex items-center text-base justify-center">
                                        <Checkbox className="border border-black" crossOrigin={"*"} color="green" onChange={(e) => updateItemCompleted(e.target.checked, item)} defaultChecked={item.completed} />
                                    </label>
                                </div>)
                            }


                        </div>

                    </div>
                </div>
            </div>
        </>

    )
}

export default Todo
