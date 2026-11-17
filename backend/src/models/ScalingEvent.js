const sequelize = require('../config/database');

let ScalingEvent;

if (!sequelize.isFallback && typeof sequelize.define === 'function') {
    try {
        const { DataTypes } = require('sequelize');
        ScalingEvent = sequelize.define('ScalingEvent', {
            action: {
                type: DataTypes.STRING,
                allowNull: false
            },
            instances: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            cpu: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            confidence: {
                type: DataTypes.FLOAT,
                allowNull: true
            },
            ts: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        });
    } catch (err) {
        console.warn('[WARN] Failed to define Sequelize model, falling back to in-memory store:', err.message);
    }
}

if (!ScalingEvent) {
    const inMemoryEvents = [];
    ScalingEvent = {
        create: async (data) => {
            const event = {
                id: inMemoryEvents.length + 1,
                action: data.action,
                instances: data.instances,
                cpu: data.cpu !== undefined ? data.cpu : null,
                confidence: data.confidence !== undefined ? data.confidence : null,
                ts: data.ts || new Date()
            };
            inMemoryEvents.push(event);
            if (inMemoryEvents.length > 200) inMemoryEvents.shift();
            return event;
        },
        count: async ({ where } = {}) => {
            if (where?.action) {
                return inMemoryEvents.filter(e => !['NO_ACTION', 'COOLDOWN'].includes(e.action)).length;
            }
            return inMemoryEvents.length;
        },
        max: async (field) => {
            if (inMemoryEvents.length === 0) return 1;
            return Math.max(...inMemoryEvents.map(e => e[field] || 1));
        },
        findAll: async ({ limit } = {}) => {
            const sorted = [...inMemoryEvents].sort((a, b) => new Date(b.ts) - new Date(a.ts));
            return limit ? sorted.slice(0, limit) : sorted;
        },
        destroy: async () => {
            inMemoryEvents.length = 0;
            return true;
        }
    };
}

module.exports = ScalingEvent;
