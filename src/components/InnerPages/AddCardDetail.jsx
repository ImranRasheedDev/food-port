import { useForm, Controller } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom";

export default function AddCardDetail() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
        setValue
    } = useForm();

    const onSubmit = (data) => {
        console.log("Card Details:", data);
        navigate("/order-waiting");
    };

    // Format card number with spaces every 4 digits
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    // Format expiry date as MM/YY
    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    // Format CVC (only numbers, max 4 digits)
    const formatCVC = (value) => {
        return value.replace(/[^0-9]/gi, '').substring(0, 4);
    };

    return (
        <div>
            <h2 className="font-semibold text-xl mb-10">Add Card Details</h2>
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <Label className="mb-4">Card Number</Label>
                    <Input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className={`bg-primary-1017 h-14 border rounded-none ${errors.cardNumber ? 'border-red-500' : ''
                            }`}
                        {...register("cardNumber", {
                            required: "Card number is required",
                            pattern: {
                                value: /^[0-9\s]{13,19}$/,
                                message: "Please enter a valid card number"
                            },
                            minLength: {
                                value: 13,
                                message: "Card number must be at least 13 digits"
                            }
                        })}
                        onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            setValue("cardNumber", formatted);
                        }}
                    />
                    {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-x-10">
                    <div>
                        <Label className="mb-4">MM/YY</Label>
                        <Input
                            type="text"
                            placeholder="MM/YY"
                            className={`bg-primary-1017 h-14 border rounded-none ${errors.expiryDate ? 'border-red-500' : ''
                                }`}
                            {...register("expiryDate", {
                                required: "Expiry date is required",
                                pattern: {
                                    value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                                    message: "Please enter a valid expiry date (MM/YY)"
                                }
                            })}
                            onChange={(e) => {
                                const formatted = formatExpiryDate(e.target.value);
                                setValue("expiryDate", formatted);
                            }}
                        />
                        {errors.expiryDate && (
                            <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>
                        )}
                    </div>
                    <div>
                        <Label className="mb-4">CVC</Label>
                        <Input
                            type="text"
                            placeholder="123"
                            className={`bg-primary-1017 h-14 border rounded-none ${errors.cvc ? 'border-red-500' : ''
                                }`}
                            {...register("cvc", {
                                required: "CVC is required",
                                pattern: {
                                    value: /^[0-9]{3,4}$/,
                                    message: "Please enter a valid CVC (3-4 digits)"
                                }
                            })}
                            onChange={(e) => {
                                const formatted = formatCVC(e.target.value);
                                setValue("cvc", formatted);
                            }}
                        />
                        {errors.cvc && (
                            <p className="text-red-500 text-sm mt-1">{errors.cvc.message}</p>
                        )}
                    </div>
                </div>
                <div>
                    <Label className="mb-4">Name of card holder</Label>
                    <Input
                        type="text"
                        placeholder="John Doe"
                        className={`bg-primary-1017 h-14 border rounded-none ${errors.cardholderName ? 'border-red-500' : ''
                            }`}
                        {...register("cardholderName", {
                            required: "Cardholder name is required",
                            minLength: {
                                value: 2,
                                message: "Name must be at least 2 characters"
                            },
                            pattern: {
                                value: /^[a-zA-Z\s]+$/,
                                message: "Name can only contain letters and spaces"
                            }
                        })}
                    />
                    {errors.cardholderName && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardholderName.message}</p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Controller
                        name="termsAccepted"
                        control={control}
                        rules={{ required: "You must accept the terms and conditions" }}
                        render={({ field }) => (
                            <Checkbox
                                id="terms"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                    <Label htmlFor="terms">I agree to the terms and conditions</Label>
                </div>
                {errors.termsAccepted && (
                    <p className="text-red-500 text-sm">{errors.termsAccepted.message}</p>
                )}
                <div>
                    <button type="submit" className="bg-primary-50 rounded-full h-14 w-full text-white cursor-pointer">Done</button>
                </div>
            </form>
        </div>
    )
}