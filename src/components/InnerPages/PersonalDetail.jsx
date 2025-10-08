import { useForm } from "react-hook-form";
import { Input } from "../ui/input";

export default function PersonalDetail() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log("Form Data:", data);
    };

    return (
        <div className="bg-primary-995 p-10 rounded-lg border border-primary-1006">
            <h1 className=" font-bold text-2xl mb-6">Personal details</h1>
            <form className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <Input
                        type="email"
                        placeholder="Enter Your Email"
                        id="email"
                        className={`w-full border rounded-md h-14 px-8 ${errors.email ? 'border-red-500' : 'border-primary-1007'
                            }`}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>
                <div>
                    <Input
                        type="text"
                        placeholder="Full Name"
                        id="fullName"
                        className={`w-full border rounded-md h-14 px-8 ${errors.fullName ? 'border-red-500' : 'border-primary-1007'
                            }`}
                        {...register("fullName", {
                            required: "Full name is required",
                            minLength: {
                                value: 2,
                                message: "Full name must be at least 2 characters"
                            }
                        })}
                    />
                    {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                </div>
                <div>
                    <Input
                        type="text"
                        placeholder="Mobile Number"
                        id="mobileNumber"
                        className={`w-full border rounded-md h-14 px-8 ${errors.mobileNumber ? 'border-red-500' : 'border-primary-1007'
                            }`}
                        {...register("mobileNumber", {
                            required: "Mobile number is required",
                            pattern: {
                                value: /^[0-9]{10,15}$/,
                                message: "Please enter a valid mobile number (10-15 digits)"
                            }
                        })}
                    />
                    {errors.mobileNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.mobileNumber.message}</p>
                    )}
                </div>
                <div>
                    <button type="submit" className="bg-primary-50 rounded-full h-14 w-full text-white cursor-pointer">Save</button>
                </div>
            </form>
        </div>
    )
}