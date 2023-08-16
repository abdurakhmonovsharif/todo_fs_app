import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
    Spinner,
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom'
import { useRegisterMutation } from "../redux/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/stateReducers/userReducer";
function Register() {
    const navigate = useNavigate()
    const [registerMutation, { isLoading, isError }] = useRegisterMutation();
    const currentUser = useSelector((state: any) => state.user)
    const dispatch = useDispatch();
    const handleSignUp = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            username: { value: string };
            password: { value: string };
            confirm: { value: string };
        };
        const username = target.username.value;
        const password = target.password.value;
        const confirm = target.confirm.value;
        const user: User = {
            username,
            password
        }
        if (confirm === password) {
            const result: any = await registerMutation(user);
            dispatch(setUser(result.data.user));
            localStorage.setItem("user_token", result.data.token);
            localStorage.setItem("user", JSON.stringify(result.data.user))
            localStorage.setItem("auth", "true")
            setTimeout(() => {
                console.log("CurrentUser after dispatch:", currentUser);
            }, 0);
            navigate("/")
        }
    }
    return (
        <div className="w-full flex items-center justify-center h-screen">
            <Card color="transparent" shadow={false}>
                <Typography variant="h4" color="blue-gray">
                    Sign Up
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                    Enter your details to register.
                </Typography>
                <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSignUp}>
                    <div className="mb-4 flex flex-col gap-6">
                        <Input
                            required
                            crossOrigin={"*"} size="lg" label="Username" name="username" />

                        <Input
                            required
                            crossOrigin={"*"} type="password" size="lg" label="Password" name="password" />
                        <Input
                            required
                            crossOrigin={"*"} type="password" size="lg" label="Confirm password" name="confirm" />
                    </div>
                    <Checkbox
                        crossOrigin={"*"}
                        required
                        label={
                            <Typography
                                variant="small"
                                color="gray"
                                className="flex items-center font-normal"
                            >
                                I agree the
                                <a
                                    href="#"
                                    className="font-medium transition-colors hover:text-gray-900"
                                >
                                    &nbsp;Terms and Conditions
                                </a>
                            </Typography>
                        }
                        containerProps={{ className: "-ml-2.5" }}
                    />
                    <Button className="mt-6" fullWidth type="submit">
                        {
                            isLoading ? <Spinner /> : "Register"
                        }
                    </Button>
                    <Typography color="gray" className="mt-4 text-center font-normal">
                        Already have an account?{" "}
                        <span onClick={() => navigate("/login")} className="font-medium text-gray-900 cursor-pointer">
                            Sign In
                        </span>
                    </Typography>
                </form>
            </Card>
        </div>
    )
}

export default Register
