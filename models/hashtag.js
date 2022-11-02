module.exports = (sequelize, DataTypes) => (
    sequelize.define('hashtag', { // 해시태그 모델의 태그 이름을 저장 나중에 태그로 검색하기 위해서
        title: {
            type: DataTypes.STRING(15),
            allowNull : false,
            unique: true,
        },
    }, {
        timestamps : true, // createdAt, updatedAt, deletedAt 칼럼도 생성
        paranoid: true,  // createdAt, updatedAt, deletedAt 칼럼도 생성
    })
);