import { FC, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../../../../hooks/redux';
import { userSlice } from '../../../../../../store/reducers/UserSlice/UserSlice';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { Box, Tooltip } from '@mui/material';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { errorHandler } from '../../../../../../utils/alarmHandler';
import config from '../../../../../../config/config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ModalSelectVisitType: FC = () => {
  // Флаг, открыта ли форма
  const show = useAppSelector((state) => state.userReducer.modalSelectVisitType);
  const { setShowModalSelectVisitType, setShowModalAddPrimaryVisit, setSelectedPrimaryVisit } =
    userSlice.actions;

  const dispatch = useAppDispatch();

  // Состояние, характерное для загрузки
  const [isPreload, setPreload] = useState<boolean>(false);

  // Выбранная запись. Не подлежит редактированию!
  const selectedData = useAppSelector((state) => state.userReducer.selectedPrimaryVisit);
  const user = useAppSelector((state) => state.globalUserReducer.globalUser);

  const handleClose = (): void => {
    dispatch(setShowModalSelectVisitType(false));
  };

  const navigate = useNavigate();

  const [data, setData] = useState({});

  return (
    <Modal
      show={show}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={handleClose}
    >
      <Modal.Header className="justify-content-center">
        <Modal.Title className="fs-6">{`Выбор случая обращения`}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-1 pb-1">
        <Container fluid>
          <Row>
            <Col className="ps-0">
              <Box sx={{ minHeight: 352, minWidth: 250 }}>
                <SimpleTreeView>
                  <TreeItem
                    itemId="primary_visit"
                    label="Первичный прием"
                    onClick={() => {
                      handleClose();
                      dispatch(setShowModalAddPrimaryVisit(true));
                    }}
                  />
                  <TreeItem itemId="elective_opetations" label="Плановые перативные вмешательства">
                    <TreeItem
                      itemId="oge"
                      label="Овариогистерэктомия (кошки)"
                      onClick={() => {
                        setPreload(true);

                        setData({
                          ...data,
                          user_id: user.id,
                          owner_id: selectedData.owner_id,
                          patient_id: selectedData.id,
                          anamnesis: 'Анамнез относительно спокоен',
                          examination: 't38,5',
                          result: `1. Антибиотик Кладакса 40 мг по 1 таб 2 раза в день в течение 21 дня, самостоятельно не отменять.\n2. Попону носить минимум 14 дней.\n3. Швы не обрабатывать, снятие швов не ранее, чем через 14 дней.\n4. Избегать переохлаждения, физических нагрузок, ограничить подвижность, транспортировку животного проводить аккуратно (под живот не брать).\n5. Следить за общим состоянием: аппетит, активность, дыхание, мочеиспускание, стул. При ухудшении состояния – на прием.\n6. Обработки от паразитов: проводить не реже 1 р/3 мес, в теплый период допустимо чаще. Комплексные капли на кожу: Гельминтал, Селафорт, Стронгхолд, Инспектор. Таблетки от гельминтов: Мильбемакс, Милпразон, Дронтал, Квантум. Препараты от эктопаразитов: Фиприст спрей / спот-он, Фронтлайн спрей/ спот-он. Препараты подбирать по весу, обрабатывать всех животных в контакте.\n7. Кормление: корма премиум и супер премиум: Авард, Сириус, Монж, Про План, Роял Канин, Бест Диннер, бюджетный Дарси, Мелвин, АльфаПет Меню. Можно как сухой, так и влажный корм, но предпочтительно одной фирмы.\n\nВ месте хирургического доступа возможно образование серомы (скопление серозной жидкости в месте травматизации ткани), проходит самостоятельно в течение нескольких недель.\n\nПри самостоятельном изменении владельцем животного назначений без консультации с лечащим врачом - ответственность за результат лечения/хирургических процедур несет владелец животного.`,
                        });

                        if (config.url_provet_api) {
                          axios
                            .post(
                              `${config.url_provet_api}directories/primary_visits/primary_visit`,
                              data,
                              {
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                              },
                            )
                            .then((res) => {
                              handleClose();
                              navigate('/visits/' + res.data.response.id);
                            })
                            .catch((error) => {
                              errorHandler(error);
                            })
                            .finally(() => {
                              setPreload(false);
                            });
                        }
                      }}
                    />
                    <TreeItem
                      itemId="2"
                      label="Плановая орхиэктомия"
                      onClick={() => {
                        //dispatch(setSelectedPrimaryVisit(null));
                        errorHandler('В процессе разработки...');
                      }}
                    />
                    <TreeItem
                      itemId="3"
                      label="Плановая УЗ чистка зубов"
                      onClick={() => {
                        //dispatch(setSelectedPrimaryVisit(null));
                        errorHandler('В процессе разработки...');
                      }}
                    />
                  </TreeItem>
                </SimpleTreeView>
              </Box>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Row className="w-100">
          В процессе выбора плановых оперативных вмешательств формируется первичный прием животного,
          заполняется шаблон
        </Row>
        <Row className="w-100">Выберите случай обращения</Row>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSelectVisitType;
