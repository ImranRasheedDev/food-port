import React from 'react'
import DialyDealsCard from '../Cards/DialyDealsCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import SectionInfo from './SectionInfo';
const DialyDeals = () => {
    return (
        <div>
            <SectionInfo title={"Daily Deals!"} description={"We're committed to cook healthy to ensure they retain their freshness and nutritional value, guaranteeing a delightful experience."} />

            <Swiper pagination={true} modules={[Pagination]} className="deals-swiper">
                <SwiperSlide>
                    <DialyDealsCard link="/resturants-detail" title="Best deals Crispy Sandwiches" description="Enjoy the large size of sandwiches. Complete perfect slice of sandwiches." />
                </SwiperSlide>
                <SwiperSlide>
                    <DialyDealsCard link="/resturants-detail" title="Best deals Crispy Sandwiches" description="Enjoy the large size of sandwiches. Complete perfect slice of sandwiches." />
                </SwiperSlide>
                <SwiperSlide>
                    <DialyDealsCard link="/resturants-detail" title="Best deals Crispy Sandwiches" description="Enjoy the large size of sandwiches. Complete perfect slice of sandwiches." />
                </SwiperSlide>
            </Swiper>
            {/* <DialyDealsCard title="Best deals Crispy Sandwiches" description="Enjoy the large size of sandwiches. Complete perfect slice of sandwiches." link="" /> */}
        </div>
    )
}

export default DialyDeals