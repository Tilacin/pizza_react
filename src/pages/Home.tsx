import React from "react";

import qs from "qs";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Categories from "../components/Categories";
import Sort, { sortList } from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock/PizzaBlock";
import { Skeleton } from "../components/PizzaBlock/Skeleton";
import Pagination from "../components/Pagination/pagination";

import { SearchPizzaParams } from "../redux/pizza/types";
import { useAppDispatch } from "../redux/store";
import { selectFilter } from "../redux/filter/selectors";
import { selectPizzaData } from "../redux/pizza/selector";
import { setCategoryId, setCurentPage, setFilters } from "../redux/filter/slice";
import { fetchPizzas } from "../redux/pizza/asyncActions";


let Home: React.FC = () => {
  
  const dispatch = useAppDispatch();
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);
  const { items, status } = useSelector(selectPizzaData);
  const { categoryId, sort, currentPage, searchValue } =
    useSelector(selectFilter);
  const sortType = sort.sortProperty;

  //const [isLoading, setIsLoading] = React.useState(true); //скелетон
  const onChangeCategory = React.useCallback((id: number) => {
    dispatch(setCategoryId(id));
  }, []);

  const onChangePage = (value: number) => {
    dispatch(setCurentPage(value));
  };

  const getPizzas = async () => {
    const sortBy = sortType.replace("-", "");
    const order = sortType.includes("-") ? "asc" : "desc";
    const category = categoryId > 0 ? `category=${categoryId}` : "";
    const search = searchValue ? `&search=${searchValue}` : "";

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        category,
        search,
        currentPage: String(currentPage),
      })
     
    );
    
    window.scrollTo(0, 0);
  };

  //   React.useEffect(() => {
  //     //для вшивания строки в адрес
  //     if (isMounted.current) {
  //       const queryString = qs.stringify({
  //         sortProperty: sortType,
  //         categoryId,
  //         currentPage,
  //       });
  //       navigate(`?${queryString}`);
  //     }
  //     isMounted.current = true;
  //   }, [categoryId, sortType,searchValue, currentPage]);

  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(
        window.location.search.substring(1)
      ) as unknown as SearchPizzaParams;
      const sort = sortList.find((obj) => obj.sortProperty === params.sortBy);
     
      dispatch(
        setFilters({
          searchValue: params.search,
          categoryId: Number(params.category),
          currentPage: Number(params.currentPage),
          sort: sort || sortList[0],
        })
      );
    }
    isMounted.current = true;
  }, []);

  //получаем и отрисовываем пиццы с бэка, что бы бесконечно не отрисовывалось оборачиваем в .useEffect()
  React.useEffect(() => {
    window.scrollTo(0, 0); //при рендере оказываемся всегда в верху страницы
    if (!isSearch.current) {
      getPizzas();
    }
    isSearch.current = false;
  }, [categoryId, sortType, searchValue, currentPage]); //если меняется категория(categoryId) или сорт(sortType) всегда делать запрос

  const pizzas = items.map((obj: any) => <PizzaBlock key={obj.id} {...obj} />);
  const skeletons = [...new Array(6)].map((_, index) => (
    <Skeleton key={index} />
  ));
  return (
    <div className="content">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        {/*прокидываем пропс в категории */}
        <Sort value={sort}/>
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === "error" ? (
        <div className="content__error-info">
          <h2>Произошла ошибка 😕</h2>
          <p>К сожалению не удалось получить пиццы</p>
        </div>
      ) : (
        <div className="content__items">
          {/*пока идёт загрузка - отображаем фейковый массив, элементы скелетон, иначе пиццы*/}
          {status === "loading" ? skeletons : pizzas}
        </div>
      )}

      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
