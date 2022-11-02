module.exports = (sequelize, DataTypes) => (
    sequelize.define('post', {
        content: {
            type: DataTypes.STRING(140),
            allowNull : false,
        },
        img: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
    }, {
        timestamps : true, // createdAt, updatedAt, deletedAt 칼럼도 생성
        paranoid: true,  // createdAt, updatedAt, deletedAt 칼럼도 생성
    })
);