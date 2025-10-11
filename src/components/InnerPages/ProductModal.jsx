import { Minus, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import { useState } from "react";


export default function ProductModal({ open, setOpen, image, title, description, price }) {
    const [countValue, setCountValue] = useState(1);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[880px]! p-0 block overflow-y-auto max-h-[90vh]">
                <img src={image} alt="product-modal-image" className="w-full h-[286px] object-cover block" />
                <div className="border-b border-primary-1007 mx-8 py-6 mb-4">
                    <h2 className="text-2xl font-bold mb-1">{title}</h2>
                    <p className=" text-primary-1013 mb-3">{description}</p>
                    <p className="text-2xl font-bold text-primary-50">{price}</p>
                </div>
                <div className="mx-8">
                    <h2 className="text-xl font-bold">Select your drink</h2>
                    <div className="border border-primary-1007 rounded-xl p-7 mt-4">
                        <RadioGroup defaultValue="regularCoke355ml" className="space-y-5">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem className={"border-primary-50 data-[state=checked]:[&>span>svg]:fill-white data-[state=checked]:bg-primary-50"} value="regularCoke355ml" id="regularCoke355ml" />
                                <Label htmlFor="regularCoke355ml">Regular coke 355 ml</Label>
                                <p className="text-primary-1015 ml-auto">Free</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem className={"border-primary-50 data-[state=checked]:[&>span>svg]:fill-white data-[state=checked]:bg-primary-50"} value="regularFanta355ml" id="regularFanta355ml" />
                                <Label htmlFor="regularFanta355ml">Regular Fanta 355 ml</Label>
                                <p className="text-primary-1015 ml-auto">Free</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem className={"border-primary-50 data-[state=checked]:[&>span>svg]:fill-white data-[state=checked]:bg-primary-50"} value="regularDew355ml" id="regularDew355ml" />
                                <Label htmlFor="regularDew355ml">Regular Dew 355 ml</Label>
                                <p className="text-primary-1015 ml-auto">Free</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem className={"border-primary-50 data-[state=checked]:[&>span>svg]:fill-white data-[state=checked]:bg-primary-50"} value="regularPepsi355ml" id="regularPepsi355ml" />
                                <Label htmlFor="regularPepsi355ml">Regular Pepsi 355 ml</Label>
                                <p className="text-primary-1015 ml-auto">Free</p>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <div className="mx-8 mt-8">
                    <h2 className="text-xl font-bold">Add extra instructions</h2>
                    <Textarea placeholder="eg. sauce." className="border-2 border-primary-1007 rounded-xl p-4 mt-4 h-32" />
                    <div className="flex justify-between items-center mt-8 mb-8 w-full gap-4">
                        <div className="flex justify-between items-center gap-2 ">
                            <button disabled={countValue === 1} className="border-2 border-primary-50 text-primary-50 w-6 h-6 flex justify-center items-center rounded-full cursor-pointer" onClick={() => setCountValue(countValue - 1)}>
                                <Minus className="w-4 h-4 text-primary-50" />
                            </button>
                            <span className="font-bold">{countValue}</span>
                            <button onClick={() => setCountValue(countValue + 1)} className="border-2 border-primary-50 text-primary-50 w-6 h-6 flex justify-center items-center rounded-full cursor-pointer">
                                <Plus className="w-4 h-4 text-primary-50" />
                            </button>
                        </div>
                        <div className="w-full">
                            <button onClick={() => setOpen(false)} className="bg-primary-50 cursor-pointer text-white px-4 py-2 rounded-full w-full block">Add to cart</button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}