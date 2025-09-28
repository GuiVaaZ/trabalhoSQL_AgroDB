/* =====================
   SELECT – Consultas
   ===================== */

SELECT pr.id_produtor, pr.nome AS produtor, c.orgao_emissor, c.validade
FROM produtor_rural pr
LEFT JOIN certificacao c ON pr.fk_id_certificacao = c.id_certificacao;

SELECT p.id_produto, p.nome AS produto, p.tipo, p.preco_unitario, p.unidade_medida,
       pr.nome AS produtor
FROM produto p
JOIN produtor_produto pp ON p.id_produto = pp.id_produto
JOIN produtor_rural pr ON pr.id_produtor = pp.id_produtor;

SELECT pe.id_pedido, pe.data_pedido, pe.valor_total, pe.status, c.nome AS cliente
FROM pedido pe
JOIN cliente c ON c.id_cliente = pe.fk_id_cliente;

SELECT i.fk_id_pedido, p.nome AS produto, i.quantidade, i.preco_unitario,
       (i.quantidade * i.preco_unitario) AS subtotal
FROM item_pedido i
JOIN produto p ON p.id_produto = i.fk_id_produto
WHERE i.fk_id_pedido = 1;

SELECT pr.nome AS produtor,
       SUM(i.quantidade * i.preco_unitario) AS receita_total
FROM item_pedido i
JOIN produtor_rural pr ON pr.id_produtor = i.fk_id_produtor
GROUP BY pr.nome
ORDER BY receita_total DESC;

/* =====================
   UPDATE – Atualizações
   ===================== */
   
UPDATE produtor_produto pp
JOIN item_pedido i ON i.fk_id_produto = pp.id_produto AND i.fk_id_produtor = pp.id_produtor
SET pp.quantidade_disponivel = pp.quantidade_disponivel - i.quantidade
WHERE i.fk_id_pedido = 1;

UPDATE pedido
SET status = 'Pago'
WHERE id_pedido = 1;

UPDATE pagamento
SET status = 'Confirmado', data_pagamento = CURDATE()
WHERE fk_id_pedido = 1;

UPDATE cliente
SET telefone = '(11)91234-5678'
WHERE id_cliente = 2;

/* =====================
   DELETE – Exclusões
   ===================== */

DELETE FROM item_pedido
WHERE fk_id_pedido = 3 AND fk_id_produto = 3;

DELETE FROM cliente
WHERE id_cliente = 3
AND id_cliente NOT IN (SELECT fk_id_cliente FROM pedido);

DELETE FROM produtor_produto
WHERE id_produtor = 1 AND id_produto = 2
AND (SELECT COUNT(*) FROM item_pedido WHERE fk_id_produto = 2 AND fk_id_produtor = 1) = 0;

