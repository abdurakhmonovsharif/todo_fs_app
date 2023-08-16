import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
    Spinner,
} from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from "../redux/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/stateReducers/userReducer";
function Login() {
    const navigate = useNavigate()
    const [loginMutation, { isLoading, isError }] = useLoginMutation();
    const dispatch = useDispatch();
    const handleSignIn = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            username: { value: string };
            password: { value: string };
        };
        const username = target.username.value;
        const password = target.password.value;
        const user: User = {
            username,
            password
        }
        try {
            const result: any = await loginMutation(user)
            localStorage.setItem("user_token", result.data.token);
            localStorage.setItem("user", JSON.stringify(result.data.user))
            localStorage.setItem("auth", "true")
            dispatch(setUser(result.data.user))
            navigate("/")
        } catch (err) {
            console.error('Login Error:', err);
        }
    }
    return (
        <div className="w-full flex items-center justify-center h-screen">
            <Card color="transparent" shadow={false}>
                <Typography variant="h4" color="blue-gray">
                    Sign In
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                    Enter your details to login.
                </Typography>
                <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSignIn}>
                    <div className="mb-4 flex flex-col gap-6">
                        <Input
                            required
                            crossOrigin={"*"} size="lg" label="Username" name="username" />

                        <Input
                            required
                            crossOrigin={"*"} type="password" size="lg" label="Password" name="password" />

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
                    {
                        isError && <span className="text-red-400">Something error!</span>
                    }
                    <Button className="mt-6" fullWidth type="submit" >
                        {
                            isLoading ? <Spinner /> : "Login"
                        }
                    </Button>
                    <Typography color="gray" className="mt-4 text-center font-normal">
                        Don't have an account yet?{" "}
                        <span onClick={()=>navigate("/register")}   className="font-medium text-gray-900 cursor-pointer">
                            Sign Up
                        </span>
                    </Typography>
                </form>
            </Card>
        </div>
    )
}

export default Login
