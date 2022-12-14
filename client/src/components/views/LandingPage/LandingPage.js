import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Icon, Col, Card, Row, Carousel } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import Checkbox from './Sections/CheckBox';
import Radiobox from './Sections/RadioBox';
import { continents, price } from './Sections/Datas';

function LandingPage() {

    const [Products, setProducts]= useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit,setLimit] = useState(8)
    const [PostSize,setPostSize]=useState(0)
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })
    
    useEffect(()=>{

        let body ={
            skip: Skip,
            limit:Limit
        }
        getProducts(body)
    },[])

    const getProducts = (body) =>{
        axios.post('/api/product/products',body)
        .then(response=>{
            if(response.data.success){
                if(body.loadMore){
                    setProducts([...Products, ...response.data.productInfo])
                }else{
                    setProducts(response.data.productInfo)
                }
                setPostSize(response.data.PostSize)
            }else{
                alert("상품들을 가져오는데 실패했습니다.")
            }
            }
        )
    }

    const loadMoreHandler = ()=>{

        let skip = Skip + Limit 

        let body ={
            skip: Skip,
            limit:Limit,
            loadMore:true
        }

        getProducts(body)
        setSkip(skip)
    }


    const renderCards = Products.map((product, index) => {

        return <Col lg={6} md={8} xs={24} key={index}>
            <Card
                cover={<ImageSlider images={product.images}/>}
            >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })

    const showFilterdResults =(filters)=>{
        let body ={
            skip: 0,
            limit:Limit,
            filters:filters
        }

        getProducts(body)
        setSkip(0)
    }

    const handlePrice = (value) => {
        const data = price;
        let array = [];

        for (let key in data) {
            if (data[key]._id === parseInt(value, 10)) {
                array = data[key].array;
            }
        }
        return array;
    }

    const handleFilters = (filters, category) => {

        const newFilters = { ...Filters }

        newFilters[category] = filters

        console.log('filters', filters)

        if (category === "price") {
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }
        showFilterdResults(newFilters)
        setFilters(newFilters)
    }

   
    return (
        <>
            <div style={{width: "75%", margin: '3rem auto'}}>
                <div style={{ textAlign:'center'}}>
                    <h2>Let's Travel Anywhere <Icon type="rocket"/></h2>
                </div>

                <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                    {/* CheckBox */}
                    <Checkbox list={continents} handleFilters={filters => handleFilters(filters, "continents")} />
                </Col>
                <Col lg={12} xs={24}>
                    {/* RadioBox */}
                    <Radiobox list={price} handleFilters={filters => handleFilters(filters, "price")} />
                </Col>
                </Row>
                {}
                {}
                <Row gutter={[16,16]}>
                     {renderCards}
                </Row>

                <br />

                {PostSize >= Limit &&
                <div style={{justifyContent:'center'}}>
                    <button onClick={loadMoreHandler}>더보기</button>
                </div>
                }
            </div>
        </>
    )
}

export default LandingPage